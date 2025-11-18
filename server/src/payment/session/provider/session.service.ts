import { Inject, Injectable, Provider } from '@nestjs/common';
import { Loggable } from '@logger';
import { PaymentKakaopayService } from '@paymentKakaopay';
import {
  OrderId,
  OrderSession,
  PayableToken,
  PaymentSession,
  Redirect,
  UserId,
} from '@type';

@Injectable()
export class PaymentSessionService extends Loggable {
  constructor(
    @Inject('PaymentSessionRepository')
    private readonly repo: typeof PaymentSessionRepository,
    private readonly paymentKakaopaySrv: PaymentKakaopayService,
  ) {
    super();
  }

  public isPending(userId: UserId): Promise<boolean> {
    // 카카오페이에 조회할 필요까진 없을듯?
    return this.repo.exists(userId);
  }

  /**
   * @Todo Redis Function 루아스크립트?
   */
  public async getSessionIfPending(
    userId: UserId,
  ): Promise<PaymentSession | null> {
    if (await this.isPending(userId)) {
      return null;
    }

    return this.getSession(userId);
  }

  /**
   * @Error throw NotFoundPaymentSessionException if null
   */
  public async getSession(userId: UserId): Promise<PaymentSession> {
    const session = await this.repo.read(userId);

    if (session === null) {
      throw new Error(); // NotFoundPaymentSessionException
    }

    return session;
  }

  /**
   * ### 카카오페이 결제준비하고 PaymentSession 생성
   *
   * 결제준비와 PaymentSession 생성이 원자적으로 이뤄져야 함.
   *
   * @Todo orderable 말고 필요한것만 받기
   */
  public async start(
    userId: UserId,
    orderId: OrderId,
    payableToken: PayableToken,
    orderSession: OrderSession, // @Todo - 필요한것만 받기
  ): Promise<PaymentSession> {
    let tid: string | undefined = undefined,
      redirect: Redirect | undefined = undefined;

    try {
      ({ tid, redirect } = await this.paymentKakaopaySrv.ready(
        orderSession, // @Todo - 필요한것만 넘기기, order_id, user_id, amount 등
        payableToken,
      ));

      return await this.repo.create(
        orderId,
        orderSession.order_session_id,
        tid,
        redirect,
      );
    } catch (error) {
      if (tid !== undefined) {
        await this.paymentKakaopaySrv.cancel(tid);
      }

      await this.destroy(userId); //

      // @Todo - 적절한 예외 던지기
      throw error; // PaymentSessionFaultException ?
    }
  }

  public close(userId: UserId): Promise<boolean> {
    return this.repo.delete(userId);
  }

  /**
   * @Todo 레디스세션과 카카오페이세션 불일치가능성 관리 및 실패시 처리 검토
   */
  public async destroy(
    userId: UserId,
    session?: PaymentSession,
  ): Promise<void> {
    if (session === undefined) {
      session = await this.getSession(userId);
    }

    await Promise.all([
      // 결제 준비중인것만 취소해야함
      this.paymentKakaopaySrv.cancel(session.tid),
      // @Todo - tid 확인하고 del 하는 로직 Redis Function 루아스크립트?
      this.repo.delete(userId).catch(e => this.logger.error(e)),
    ]);
  }
}

const PaymentSessionRepository = {
  async read(orderId: OrderId): Promise<PaymentSession | null> {
    orderId;
    return null;
  },

  async create(...args: any[]): Promise<PaymentSession> {
    args;
    throw new Error(); // key collision
  },

  async delete(userId: UserId): Promise<boolean> {
    userId;
    return false;
  },

  async exists(userId: UserId): Promise<boolean> {
    userId;
    return false;
  },
};

export const PaymentSessionRepositoryProvider: Provider = {
  provide: 'PaymentSessionRepository',
  useValue: PaymentSessionRepository,
};
