import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { StoreStateService } from '@store/state';
import {
  Orderable,
  OrderSession,
  OrderSessionId,
  StoreState,
  UserId
} from '@common/type';

@Injectable()
export class OrderSessionService
  extends Loggable
{
  constructor(
    private readonly repo: { read(userId: UserId): Promise<OrderSession | null>, renewTtl(userId: UserId): Promise<void> }, // OrderSessionRepository
    private readonly storeStateSrv: StoreStateService
  ) {
    super();
  }

  /**
   * - null check
   * - incomplete check (optional)
   * - renew ttl or close session
   * - check store orderable
   */
  public async getOrderable(
    userId: UserId,
    complete = false
  ): Promise<Orderable> {
    const session = await this.repo.read(userId);
    
    this.checkNull(session);

    const storeState = await this.storeStateSrv.get(session.store_id);

    complete && this.validate(session);

    this.processByStoreState(storeState, userId);

    return {
      ...session,
      store_state: storeState
    };
  }

  public areCoherent(
    sessionA: { order_session_id: OrderSessionId },
    sessionB: { order_session_id: OrderSessionId },
    sessionC?: { order_session_id: OrderSessionId }
  ): boolean {
    return sessionA.order_session_id === sessionB.order_session_id && (!sessionC || sessionA.order_session_id === sessionC.order_session_id);
  }

  public close(userId: UserId): Promise<void> {
    return this.repo.delete(userId);
  }

  private checkNull(session: OrderSession | null): asserts session is OrderSession {
    if (session === null) {
      throw new Error(); // NotFoundSession
    }
  }

  /**
   * - renew ttl or close session
   * - check orderable
   */
  private processByStoreState(
    storeState: StoreState,
    userId: UserId,
  ): void {
    (() => {
      if (this.storeStateSrv.isBusinessActive(storeState)) {
        return this.repo.renewTtl(userId);
      } else {
        return this.close(userId);
      }
    })().catch(e => this.logger.warn(e));

    if (this.storeStateSrv.isOrderable(storeState)) {
      return;
    }

    throw new Error(storeState); // NotOpenStoreException (storeState 포함)
  }

  /**
   * ### incomplete check
   * 오더세션 무결성 체크 (메인메뉴, 선택옵션 등등)  
   * 어느 부분이 미완성인지 IncompleteOrderSessionException 를 던져서 알려줌
   */
  private validate(session: OrderSession): OrderSession {
    // TODO: Implement validation logic
    return session;
  }
}
