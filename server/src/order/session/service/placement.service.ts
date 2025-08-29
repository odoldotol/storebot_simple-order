import {
  OrderId,
  OrderPlacementSession,
  OrderSession,
  OrderSessionId,
  UserId
} from "@common/type";
import { OrderIdService } from "./orderId.service";

export class OrderPlacementSessionService {

  constructor(
    private readonly repo: OrderPlacementSessionRepository,
    private readonly orderIdSrv: OrderIdService
  ) {}

  public isPending(): Promise<boolean> {
    return this.repo.isExists();
  }

  public get(userId: UserId): Promise<OrderPlacementSession | null> {
    return Promise.resolve({
      order_session_id: `${Date.now()}-0` as OrderSessionId,
      order_id: "" as OrderId
    });
  }

  public async start(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<OrderPlacementSession> {
    return this.repo.set(
      userId,
      this.orderIdSrv.generate(),
      orderSession.order_session_id
    )
  }
}
