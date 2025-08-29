import { KakaopayPaymentService } from "@payment";
import { OrderPaymentTokenService } from "./paymentToken.service";
import {
  OrderId,
  OrderPaymentSession,
  OrderPlacementSession,
  OrderSession,
  UserId
} from "@common/type";

export class OrderPaymentSessionService {

  constructor(
    private readonly repo: OrderPaymentSessionRepository,
    private readonly orderPaymentTokenSrv: OrderPaymentTokenService,
    private readonly kakaopayPaymentSrv: KakaopayPaymentService,
  ) {}

  public get(orderId: OrderId): Promise<OrderPaymentSession | null> {
    return Promise.resolve(null);
  }

  public async start(
    userId: UserId,
    orderPlacementSession: OrderPlacementSession,
    orderSession: OrderSession
  ): Promise<OrderPaymentSession> {
    if (this.repo.exists(orderPlacementSession.order_id)) {
      throw new Error(); //
    }

    const orderPaymentToken = await this.orderPaymentTokenSrv.generate(userId);

    const {
      tid,
      redirect
    } = await this.kakaopayPaymentSrv.ready(
      orderPlacementSession.order_id,
      userId,
      orderSession,
      orderPaymentToken
    );

    return this.repo.create(
      orderPlacementSession.order_id,
      orderPlacementSession.order_session_id,
      tid,
      redirect,
      orderPaymentToken
    ).catch(async (error: any) => {
      this.orderPaymentTokenSrv.destroy(orderPaymentToken).catch(e => this.logger.error(e));
      await this.kakaopayPaymentSrv.cancel( // 결제 준비중인것만 취소해야함
        tid,
      ).catch(e => this.logger.error(e)); // 치명적일것 같음... 검토필!

      throw error;
    });
  }

  public async destroy(
    orderId: OrderId,
    orderPaymentSession?: OrderPaymentSession
  ): Promise<void> {
    if (orderPaymentSession === undefined) {
      const ss = await this.get(orderId);
      return ss === null ? void 0 : this.destroy(orderId, ss);
    }

    await Promise.all([
      this.kakaopayPaymentSrv.cancel( // 결제 준비중인것만 취소해야함
        orderPaymentSession.tid
      ),
      this.repo.del(orderId).catch(e => this.logger.error(e)),
      this.orderPaymentTokenSrv.destroy(orderPaymentSession.order_payment_token).catch(e => this.logger.error(e)),
    ]);
  }
}