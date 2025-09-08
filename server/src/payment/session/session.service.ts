import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { PaymentTokenService } from './token.service';
import { KakaopayPaymentService } from '@payment/kakaopay';
import {
  Orderable,
  OrderId,
  Payable,
  PaymentSession,
  PaymentToken,
  Placeable,
  UserId,
  WithUserId,
} from '@common/type';

@Injectable()
export class PaymentSessionService extends Loggable {
  constructor(
    private readonly repo: {
      read(orderId: OrderId): Promise<PaymentSession | null>;
      create(...args: any[]): Promise<PaymentSession>;
      delete(userId: UserId): Promise<void>;
      exists(userId: UserId): Promise<boolean>;
    }, // PaymentSessionRepository,
    private readonly paymentTokenSrv: PaymentTokenService,
    private readonly kakaopayPaymentSrv: KakaopayPaymentService,
  ) {
    super();
  }

  public isPending(userId: UserId): Promise<boolean> {
    // 카카오페이에 조회할 필요까진 없을듯?
    return this.repo.exists(userId);
  }

  public async getPayable(userId: UserId): Promise<Payable>;
  public async getPayable(paymentToken: PaymentToken): Promise<Payable>;
  public async getPayable(arg: UserId | PaymentToken): Promise<Payable> {
    let userId: UserId;
    let orderId: OrderId | undefined = undefined;

    // @Todo - UserId 인지 PaymentToken 인지 길이가 16인지로 Identify 한다는것이 나쁨.
    if (arg.length === 16) {
      ({ userId, orderId } = await this.paymentTokenSrv.getIds(arg));
    } else {
      userId = arg;
    }

    const session = await this.repo.read(userId);

    if (session === null) {
      throw new Error(); // NotFoundPaymentSessionException
    }

    if (orderId !== undefined && session.order_id !== orderId) {
      throw new Error(); // PaymentSessionFaultException
    }

    return {
      user_id: userId,
      ...session,
    };
  }

  public async start(
    orderId: OrderId,
    orderable: Orderable,
  ): Promise<Placeable> {
    if (await this.repo.exists(orderId)) {
      throw new Error(); // PaymentSessionFaultException
    }

    const paymentToken = await this.paymentTokenSrv.generate(
      orderable.user_id,
      orderId,
    );

    const { tid, redirect } = await this.kakaopayPaymentSrv.ready(
      orderable,
      paymentToken,
    );

    const paymentSession = await this.repo
      .create(orderId, orderable.order_session_id, tid, redirect, paymentToken)
      .catch(async (error: any) => {
        await this.destroy(orderable.user_id); //
        throw error; // PaymentSessionFaultException
      });

    return {
      ...orderable,
      ...paymentSession,
    };
  }

  public async close(withUserId: WithUserId): Promise<void> {
    try {
      await this.repo.delete(withUserId.user_id);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  /**
   * 실패시 치명적인 상황 검토필!
   */
  public async destroy(user_id: UserId): Promise<void>;
  public async destroy(payable: Payable): Promise<void>;
  public async destroy(arg: UserId | Payable): Promise<void>;
  public async destroy(arg: UserId | Payable): Promise<void> {
    if (typeof arg === 'string') {
      const ss = await this.repo.read(arg);
      return ss ? this.destroy({ user_id: arg, ...ss }) : void 0;
    }

    await Promise.all([
      // 결제 준비중인것만 취소해야함
      this.kakaopayPaymentSrv.cancel(arg.tid),
      this.paymentTokenSrv
        .destroy(arg.payment_token)
        .catch(e => this.logger.error(e)),
      this.repo.delete(arg.user_id).catch(e => this.logger.error(e)),
    ]);
  }
}
