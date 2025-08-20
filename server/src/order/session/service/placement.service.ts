import {
  OrderId,
  OrderPlacementSession,
  OrderSessionId,
  UserId
} from "@common/type";
import { OrderSessionService } from "./order.service";
import { OrderIdService } from "./orderId.service";

export class OrderPlacementSessionService {

  constructor(
    private readonly repo: OrderPlacementSessionRepository,
    private readonly orderSessionSrv: OrderSessionService,
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

  public async start(userId: UserId): Promise<OrderPlacementSession> {
    return this.repo.set(
      userId,
      this.orderIdSrv.generate(),
      await this.orderSessionSrv.getSessionId(userId)
    )
  }
}
