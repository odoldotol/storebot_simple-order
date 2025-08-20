import { Injectable } from '@nestjs/common';
import {
  OrderPaymentSessionService,
  OrderPlacementSessionService,
  OrderSessionService
} from '@order/session';
import { StoreStateService } from '@store/state';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import { OrderStreamApprovalService } from '@order/stream';
import { OrderPaymentSession, OrderPlacementSession, OrderSession, UserId } from '@common/type';

@Injectable()
export class OrderPlacementService {

  constructor(
    private readonly storeStateSrv: StoreStateService,
    private readonly orderPlacementSessionSrv: OrderPlacementSessionService,
    private readonly orderSessionSrv: OrderSessionService,
    private readonly orderPaymentSessionSrv: OrderPaymentSessionService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
    private readonly orderStreamApprovalSrv: OrderStreamApprovalService
  ) {}

  public async place(userId: UserId): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderSession = await this.orderSessionSrv.getWithRenewTtl(userId);

    if (orderSession === null) {
      throw new Error(); //
    }

    if ((await this.storeStateSrv.isOpen(orderSession.store_id)) === false) {
      // 실패
    }

    if (await this.orderPlacementSessionSrv.isPending()) {
      return this.placeInPending(userId, orderSession);
    }

    return this.placeNew(userId, orderSession);
  }

  private async placeInPending(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderPlacementSession = await this.orderPlacementSessionSrv.get(userId);

    if (orderPlacementSession === null) {
      return this.placeNew(userId, orderSession); // never
    }

    const orderPaymentSession = await this.orderPaymentSessionSrv.get(orderPlacementSession.order_id);

    if (orderPaymentSession === null) {
      return this.placeNew(userId, orderSession);
    }

    if (this.orderSessionSrv.isSame(orderSession, orderPlacementSession, orderPaymentSession) === true) {
      return {
        orderSession,
        orderPlacementSession,
        orderPaymentSession
      };
    }

    await this.orderPaymentSessionSrv.destroy(orderPlacementSession.order_id, orderPaymentSession);

    return this.placeNew(userId, orderSession);
  }

  private async placeNew(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderPlacementSession = await this.orderPlacementSessionSrv.start(userId);

    if (this.orderSessionSrv.isSame(orderSession, orderPlacementSession) === false) {
      throw new Error(); //
    }

    const orderPaymentSession = await this.orderPaymentSessionSrv.start(
      userId,
      orderPlacementSession,
      orderSession
    );

    return {
      orderSession,
      orderPlacementSession,
      orderPaymentSession
    };
  }

  public async approve(userId: UserId) {
    try {
      const orderSession = await this.orderSessionSrv.get(userId);
      const orderPlacementSession = await this.orderPlacementSessionSrv.get(userId);

      if (orderPlacementSession === null || orderSession === null) {
        throw new Error();
      }

      if ((await this.storeStateSrv.isOpen(orderSession.store_id)) === false) {
        throw new Error();
      }

      const orderPaymentSession = await this.orderPaymentSessionSrv.get(orderPlacementSession.order_id);

      if (orderPaymentSession === null) {
        throw new Error();
      }

      if (this.orderSessionSrv.isSame(orderSession, orderPlacementSession, orderPaymentSession) === false) {
        throw new Error();
      }

      this.orderStreamApprovalSrv.push(
        orderSession,
        orderPlacementSession,
        orderPaymentSession
      )
      .catch(error => {
        // 실패처리, 결제세션파괴, 플레이스먼트 세션 제거, 실패알럿
        this.orderPlacementApprovalResponseSrv.error(orderPlacementSession.order_id, error);
      })
      .then(() => {
        // 3개 세션 모두 제거
      })

      // 메시지푸시보다 응답 매핑이 먼저 일어나야함
      return this.orderPlacementApprovalResponseSrv.response(orderPlacementSession.order_id);

    } catch (error) {
      // 실패처리, 결제세션파괴, 플레이스먼트 세션 제거, 실패알럿
    }
  }
}
