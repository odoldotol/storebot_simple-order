import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { PaymentTokenService } from './token.service';
import { KakaopayPaymentService } from '@payment';
import {
  OrderId,
  OrderPlacementSession,
  OrderSession,
  PaymentSession,
  UserId
} from "@common/type";

@Injectable()
export class PaymentSessionService
  extends Loggable
{

  constructor(
    private readonly repo: PaymentSessionRepository,
    private readonly paymentTokenSrv: PaymentTokenService,
    private readonly kakaopayPaymentSrv: KakaopayPaymentService,
  ) {
    super();
  }

  public async getPayable(orderId: OrderId): Promise<PaymentSession> {
    const session = await this.repo.read(orderId)
    if (session === null) {
      throw new Error(); // NotFoundPaymentSessionException
    }
    return session;
  }

  public async start(
    userId: UserId,
    orderPlacementSession: OrderPlacementSession,
    orderSession: OrderSession
  ): Promise<PaymentSession> {
    if (this.repo.exists(orderPlacementSession.order_id)) {
      throw new Error(); //
    }

    const paymentToken = await this.paymentTokenSrv.generate(userId);

    const {
      tid,
      redirect
    } = await this.kakaopayPaymentSrv.ready(
      orderPlacementSession.order_id,
      userId,
      orderSession,
      paymentToken
    );

    return this.repo.create(
      orderPlacementSession.order_id,
      orderPlacementSession.order_session_id,
      tid,
      redirect,
      paymentToken
    ).catch(async (error: any) => {
      this.paymentTokenSrv.destroy(paymentToken).catch(e => this.logger.error(e));
      await this.kakaopayPaymentSrv.cancel( // 결제 준비중인것만 취소해야함
        tid,
      ).catch(e => this.logger.error(e)); // 치명적일것 같음... 검토필!

      throw error;
    });
  }

  public close(orderId: OrderId): Promise<void> {
    return this.repo.delete(orderId);
  }

  public async destroy(
    orderId: OrderId,
    paymentSession?: PaymentSession
  ): Promise<void> {
    if (paymentSession === undefined) {
      const ss = await this.repo.read(orderId);
      return ss === null ? void 0 : this.destroy(orderId, ss);
    }

    await Promise.all([
      this.kakaopayPaymentSrv.cancel( // 결제 준비중인것만 취소해야함
        paymentSession.tid
      ),
      this.repo.delete(orderId).catch(e => this.logger.error(e)),
      this.paymentTokenSrv.destroy(paymentSession.payment_token).catch(e => this.logger.error(e)),
    ]);
  }
}