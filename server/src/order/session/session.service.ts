import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { StoreStateService } from '@store/state';
import {
  Orderable,
  OrderSession,
  OrderSessionId,
  Placeable,
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
   * - check null
   * - check sessionId coherence (if Placeable)
   * - check incomplete (optional)
   * - check store orderable
   * - renew ttl or close session
   */
  public async getOrderable(userId: UserId, complete?: boolean): Promise<Orderable>;
  public async getOrderable(placeable: Placeable, complete?: boolean): Promise<Orderable>;
  public async getOrderable(
    arg: UserId | Placeable,
    complete = false
  ): Promise<Orderable> {
    const byPlaceable = typeof arg !== "string";
    const userId = byPlaceable ? arg.user_id : arg;

    const session = await this.repo.read(userId);

    this.checkNull(session);

    const storeStatePm = this.storeStateSrv.get(session.store_id);

    byPlaceable && this.checkId(session, arg);
    complete && this.validate(session);

    const storeState = await storeStatePm;

    this.processByStoreState(storeState, userId);

    return {
      user_id: userId,
      ...session,
      store_state: storeState
    };
  }

  public async close(orderable: Orderable): Promise<void> {
    try {
      await this.repo.delete(orderable.user_id);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  private checkNull(session: OrderSession | null): asserts session is OrderSession {
    if (session === null) {
      throw new Error(); // NotFoundSession
    }
  }

  private checkId(
    session: OrderSession,
    placeable: Placeable
  ): void {
    if (placeable.order_session_id !== session.order_session_id) {
      throw new Error(); // OrderSessionIdFaultException
    }
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

    if (this.storeStateSrv.isOrderable(storeState) === false) {
      throw new Error(storeState); // NotOpenStoreException (storeState 포함)
    }
  }
}
