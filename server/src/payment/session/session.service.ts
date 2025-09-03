import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { PaymentTokenService } from './token.service';
import { KakaopayPaymentService } from '@payment';
import {
  Orderable,
  OrderId,
  OrderPlacementSession,
  OrderSession,
  Payable,
  PaymentSession,
  Placeable,
  UserId
} from "@common/type";

@Injectable()
export class PaymentSessionService
  extends Loggable
{

  constructor(
    private readonly repo: { read(orderId: OrderId): Promise<PaymentSession | null> }, // PaymentSessionRepository,
    private readonly paymentTokenSrv: PaymentTokenService,
    private readonly kakaopayPaymentSrv: KakaopayPaymentService,
  ) {
    super();
  }

  public async getPayable(placeable: Placeable): Promise<Payable> {
    const session = await this.repo.read(placeable.order_id);
    if (session === null) {
      throw new Error(); // NotFoundPaymentSessionException
    }
    return {
      order_id: placeable.order_id,
      ...session
    };
  }

  public async start(
    placeable: Placeable,
    orderable: Orderable
  ): Promise<Payable> {
    if (this.repo.exists(placeable.order_id)) {
      throw new Error(); // PaymentSessionFaultException
    }

    const paymentToken = await this.paymentTokenSrv.generate(placeable);

    const {
      tid,
      redirect
    } = await this.kakaopayPaymentSrv.ready(
      placeable,
      orderable,
      paymentToken
    );

    const paymentSession = await this.repo.create(
      placeable.order_id,
      placeable.order_session_id,
      tid,
      redirect,
      paymentToken
    ).catch(async (error: any) => {
      await this.destroy(placeable);
      throw error; // PaymentSessionFaultException
    });

    return {
      order_id: placeable.order_id,
      ...paymentSession
    };
  }

  public async close(payable: Payable): Promise<void> {
    try {
      await this.repo.delete(payable.order_id);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  /**
   * 실패시 치명적인 상황 검토필!
   */
  public async destroy(placeable: Placeable): Promise<void>;
  public async destroy(payable: Payable): Promise<void>;
  public async destroy(arg: Placeable | Payable): Promise<void>;
  public async destroy(arg: Placeable | Payable): Promise<void> {
    if ('user_id' in arg) {
      const ss = await this.repo.read(arg.order_id);
      return ss ? this.destroy({ order_id: arg.order_id, ...ss }) : void 0;
    }

    this.repo.delete(arg.order_id).catch(e => this.logger.error(e));
    this.paymentTokenSrv.destroy(arg.payment_token).catch(e => this.logger.error(e));

    // 결제 준비중인것만 취소해야함
    await this.kakaopayPaymentSrv.cancel(arg.tid);
  }
}