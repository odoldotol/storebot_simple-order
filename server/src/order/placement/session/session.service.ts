import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { OrderIdService } from './orderId.service';
import {
  Orderable,
  OrderId,
  OrderPlacementSession,
  OrderSession,
  OrderSessionId,
  Placeable,
  UserId
} from '@common/type';

@Injectable()
export class OrderPlacementSessionService
  extends Loggable
{
  constructor(
    private readonly repo: { read(userId: UserId): Promise<OrderPlacementSession | null> }, // OrderPlacementSessionRepository,
    private readonly orderIdSrv: OrderIdService
  ) {
    super();
  }

  public isPending(): Promise<boolean> {
    return this.repo.exists();
  }

  public async getPlaceable(userId: UserId): Promise<Placeable> {
    const session = await this.repo.read(userId)

    if (session === null) {
      throw new Error(); // NotFoundOrderPlacementSessionException
    }

    return {
      user_id: userId,
      ...session
    };
  }

  public async start(orderable: Orderable): Promise<Placeable> {
    return this.repo.set(
      orderable.user_id,
      this.orderIdSrv.generate(),
      orderable.order_session_id
    );
  }

  public async close(placeable: Placeable): Promise<void> {
    try {
      await this.repo.delete(placeable.user_id);
    } catch (error) {
      this.logger.warn(error);
    }
  }
}
