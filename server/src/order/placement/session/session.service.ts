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
    return this.repo.exists();
  }

  public async getPlaceable(userId: UserId): Promise<OrderPlacementSession> {
    const session = await this.repo.read(userId)
    if (session === null) {
      throw new Error(); // NotFoundOrderPlacementSessionException
    }
    return session;
  }

  public async start(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<OrderPlacementSession> {
    return this.repo.set(
      userId,
      this.orderIdSrv.generate(),
      orderSession.order_session_id
    );
  }

  public close(userId: UserId): Promise<void> {
    return this.repo.delete(userId);
  }
}
