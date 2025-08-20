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
    ).catch((error) => {
      this.orderPaymentTokenSrv.destroy(orderPaymentToken);
      await this.kakaopayPaymentSrv.cancel(
        tid,
      );

      throw error;
    });
  }

  public async destroy(
    orderId: OrderId,
    orderPaymentSession: OrderPaymentSession
  ): Promise<void> {
    await Promise.all([
      this.kakaopayPaymentSrv.cancel(
        orderPaymentSession.tid
      ),
      this.repo.del(orderId),
      this.orderPaymentTokenSrv.destroy(orderPaymentSession.order_payment_token),
    ]);
  }
}