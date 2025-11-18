import { Injectable } from '@nestjs/common';
import { Loggable } from '@logger';
import { OrderSessionService } from '@orderSession';
import { PaymentSessionService } from '@paymentSession';
import { OrderIdService } from './orderId.service';
import { OrderMessageApprovalService } from '@orderMessage';
import { StoreStateService } from '@storeState';
import { PayableTokenService } from './payableToken.service';
import {
  IncompleteOrderSessionException,
  NotOpenStoreException,
  OrderSessionIdFaultException,
} from '@exception';
import {
  OrderId,
  OrderSession,
  OrderSessionId,
  Payable,
  PaymentSession,
  Placeable,
  StoreState,
  UserId,
} from '@type';

/**
 * @Todo 중복제거, 리팩터링
 */
@Injectable()
export class OrderPlacementService extends Loggable {
  constructor(
    private readonly orderSessionSrv: OrderSessionService,
    private readonly storeStateSrv: StoreStateService,
    private readonly orderIdSrv: OrderIdService,
    private readonly payableTokenSrv: PayableTokenService,
    private readonly paymentSessionSrv: PaymentSessionService,
    private readonly orderMessageApprovalSrv: OrderMessageApprovalService,
  ) {
    super();
  }

  /**
   * ### OrderSession, StoreState, PaymentSession 으로 Payable 만들어서 리턴.
   */
  public async place(
    userId: UserId,
    orderSessionId: OrderSessionId,
  ): Promise<Payable> {
    /*
    유저는 PG 결제준비 로직에 노출될 필요가 없음, '결제전 주문확인' 과 '결제준비' 를 합쳐서 진행.
    -> 한단계 줄어든 UX, 그러나 결제준비가 자주 발생할 수 있고, 이미 준비중인 결제세션을 고려해야함.
    */

    const [pendingPaymentSession, orderSession] = await Promise.all([
      this.paymentSessionSrv.getSessionIfPending(userId),
      this.orderSessionSrv.getSession(userId, orderSessionId),
    ]);

    /**
     * ### paymentSession 의 3가지 케이스를 각각 3가지 타입으로 표현하고 이에 따라 처리함.
     * - PaymentSession: 기존 결제세션이 현 OrderSession 의 것임. 이걸로 Payable 만들어서 리턴.
     * - Promise<null>: 기존 결제세션이 현 OrderSession 의 것이 아님. 기존 결제세션 파괴 기다려야하고 이를 프로미스로 할당. 새 결제세션 만들어서 Payable 리턴.
     * - null: 결제세션 없음. 새 결제세션 만들어서 Payable 리턴.
     */
    let paymentSession: PaymentSession | Promise<null> | null = null;
    if (pendingPaymentSession !== null) {
      if (
        pendingPaymentSession.order_session_id !== orderSession.order_session_id
      ) {
        paymentSession = pendingPaymentSession;
      } else {
        paymentSession = this.paymentSessionSrv
          .destroy(userId, pendingPaymentSession)
          .then(() => null);
      }
    }

    this.checkOrderSessionComplete(orderSession);

    const storeState = await this.storeStateSrv.getState(orderSession.store_id);

    /*
    StoreState Open 아니면 NotOpenStoreException 던짐
    단, Closing | Closed 면 OrderSession 닫고 던짐 (추후 UX 고려)
    */
    if (this.storeStateSrv.isOpen(storeState) === false) {
      if (this.storeStateSrv.isBusinessInActive(storeState)) {
        this.orderSessionSrv.close(userId).catch(e => this.logger.warn(e));
      }

      throw new NotOpenStoreException(storeState);
    }

    // await destroy
    if (paymentSession instanceof Promise) {
      paymentSession = await paymentSession;
    }

    if (paymentSession === null) {
      const orderId = this.orderIdSrv.generate();
      const payableToken = await this.payableTokenSrv.generate(userId, orderId);
      paymentSession = await this.paymentSessionSrv.start(
        userId,
        orderId,
        payableToken,
        orderSession,
      );
    }

    return this.createPayable(userId, orderSession, storeState, paymentSession);
  }

  /**
   * placeable 만들어서 OrderApproval 메세지 추가하고 메세지id 리턴
   */
  public async approve(
    pgToken: string,
    userId: UserId,
    orderId: OrderId,
  ): Promise<string> {
    // @Todo - 에러처리: 세션 파괴, 승인실패 메시지 푸시

    const [paymentSession, orderSession] = await Promise.all([
      this.paymentSessionSrv.getSession(userId),
      this.orderSessionSrv.getSession(userId),
    ]);

    // PaymentSession 찾아서 order_id 다르면 PaymentSessionFaultException 던지기
    if (paymentSession.order_id !== orderId) {
      throw new Error(); // PaymentSessionFaultException
    }

    if (paymentSession.order_session_id !== orderSession.order_session_id) {
      throw new OrderSessionIdFaultException(orderSession);
    }

    const storeState = await this.storeStateSrv.getState(orderSession.store_id);

    /*
    StoreState Open 아니면 NotOpenStoreException 던짐
    단, Closing | Closed 면 OrderSession 닫고 던짐 (추후 UX 고려)
    */
    if (this.storeStateSrv.isOpen(storeState) === false) {
      if (this.storeStateSrv.isBusinessInActive(storeState)) {
        this.orderSessionSrv.close(userId).catch(e => this.logger.warn(e));
      }

      throw new NotOpenStoreException(storeState);
    }

    // @Todo - userId 로 nickname 가져오기, 유저 객체(user_info?) 쓰자..
    const nickname = Promise.resolve('');

    // 세션 제거 후에 메시지 푸시
    await Promise.all([
      this.orderSessionSrv.close(userId),
      this.paymentSessionSrv.close(userId),
    ]);

    const placeable = this.createPlaceable(
      pgToken,
      this.createPayable(userId, orderSession, storeState, paymentSession),
      await nickname,
    );

    return this.orderMessageApprovalSrv.push(placeable);
  }

  /**
   * ### 주문이 완성되었는지 체크
   * 메인메뉴, 선택옵션 등등 \
   * 어느 부분이 미완성인지 IncompleteOrderSessionException 를 던져서 알려줌
   *
   * @Todo 클라이언트(지금은 챗봇모듈)에서 처리(완성된 주문일때부터 주문하기 버튼을 넣어주는것)하는것 필요. 서버에서 검증도 일부 필요할 수 있음.
   */
  private checkOrderSessionComplete(orderSession: OrderSession): void {
    orderSession; // @Todo - Implement validation logic
    throw new IncompleteOrderSessionException({});
  }

  private createPayable(
    userId: UserId,
    orderSession: OrderSession,
    storeState: StoreState,
    paymentSession: PaymentSession,
  ): Payable {
    return {
      ...orderSession,
      ...storeState,
      ...paymentSession,
      user_id: userId,
    };
  }

  private createPlaceable(
    pgToken: string,
    payable: Payable,
    nickname: string,
  ): Placeable {
    return {
      ...payable,
      nickname,
      pg_token: pgToken,
    };
  }
}
