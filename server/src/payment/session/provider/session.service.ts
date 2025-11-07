import { Inject, Injectable, Provider } from '@nestjs/common';
import { Loggable } from '@logger';
import { PaymentSessionTokenService } from './token.service';
import { PaymentKakaopayService } from '@paymentKakaopay';
import {
  Orderable,
  OrderId,
  Payable,
  PaymentSession,
  UserId,
} from '@type';

@Injectable()
export class PaymentSessionService extends Loggable {
  constructor(
    @Inject('PaymentSessionRepository')
    private readonly repo: typeof PaymentSessionRepository,
    private readonly paymentSessionTokenSrv: PaymentSessionTokenService,
    private readonly paymentKakaopaySrv: PaymentKakaopayService,
  ) {
    super();
  }

  public isPending(userId: UserId): Promise<boolean> {
    // 카카오페이에 조회할 필요까진 없을듯?
    return this.repo.exists(userId);
  }

  public async getSession(userId: UserId): Promise<PaymentSession> {
    const session = await this.repo.read(userId);

    if (session === null) {
      throw new Error(); // NotFoundPaymentSessionException
    }

    return session;
  }

  public async start(
    userId: UserId,
    orderId: OrderId,
    orderable: Orderable,
  ): Promise<Payable> {
    if (await this.repo.exists(orderId)) {
      throw new Error(); // PaymentSessionFaultException
    }

    const paymentToken = await this.paymentSessionTokenSrv.generate(userId, orderId);

    const { tid, redirect } = await this.paymentKakaopaySrv.ready(
      orderable,
      paymentToken,
    );

    const paymentSession = await this.repo
      .create(orderId, orderable.order_session_id, tid, redirect, paymentToken)
      .catch(async (error: any) => {
        await this.paymentKakaopaySrv.cancel(tid);
        await this.destroy(userId); //
        throw error; // PaymentSessionFaultException
      });

    return {
      ...orderable,
      ...paymentSession,
    };
  }

  public async close(userId: UserId): Promise<void> {
    try {
      await this.repo.delete(userId);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  /**
   * 실패시 치명적인 상황 검토필!
   * 
   * @Todo 불필요한 재귀함수 형태
   */
  public async destroy(user_id: UserId, session?: PaymentSession): Promise<void> {
    if (session === undefined) {
      session = await this.repo.read(user_id) ?? undefined;
      return session ? this.destroy(user_id, session) : void 0;
    }

    await Promise.all([
      // 결제 준비중인것만 취소해야함
      this.paymentKakaopaySrv.cancel(session.tid),
      this.paymentSessionTokenSrv
        .destroy(session.payment_token)
        .catch(e => this.logger.error(e)),
      this.repo.delete(user_id).catch(e => this.logger.error(e)),
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

  async delete(userId: UserId): Promise<void> {
    userId;
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
