import { Injectable } from '@nestjs/common';
import { Loggable } from '@logger';
import { OrderSessionRepository } from './session.repository';
import { OrderSession, OrderSessionId, UserId } from '@type';
import {
  NotFoundOrderSessionException,
  OrderSessionIdFaultException,
} from '@exception';

@Injectable()
export class OrderSessionService extends Loggable {
  constructor(private readonly repo: OrderSessionRepository) {
    super();
  }

  /**
   * renew ttl
   *
   * @param orderSessionId check if given
   * @Error throw NotFoundOrderSessionException if null
   */
  public async getSession(
    userId: UserId,
    orderSessionId?: OrderSessionId,
  ): Promise<OrderSession> {
    const session = await this.repo.read(userId);

    this.checkNull(session);

    orderSessionId !== undefined && this.checkId(session, orderSessionId);

    return session;
  }

  /**
   * @Todo implement
   */
  public addItem(): void {}

  public close(userId: UserId): Promise<boolean> {
    return this.repo.delete(userId);
  }

  private checkNull(
    session: OrderSession | null,
  ): asserts session is OrderSession {
    if (session === null) {
      throw new NotFoundOrderSessionException();
    }
  }

  private checkId(session: OrderSession, orderSessionId: OrderSessionId): void {
    if (session.order_session_id !== orderSessionId) {
      throw new OrderSessionIdFaultException(session);
    }
  }
}
