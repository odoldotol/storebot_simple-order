import { BadRequestException, Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { StoreStateService } from '@store/state';
import {
  Orderable,
  OrderSession,
  Payable,
  Placeable,
  StoreState,
  UserId,
  WithUserId,
} from '@common/type';

@Injectable()
export class OrderSessionService extends Loggable {
  constructor(
    private readonly repo: {
      read(userId: UserId): Promise<OrderSession | null>;
      renewTtl(userId: UserId): Promise<void>;
      delete(userId: UserId): Promise<void>;
    }, // OrderSessionRepository
    private readonly storeStateSrv: StoreStateService,
  ) {
    super();
  }

  /**
   * - check null
   * - check incomplete
   * - check store orderable
   * - renew ttl or close session
   */
  public async getOrderable(userId: UserId): Promise<Orderable> {
    const session = await this.repo.read(userId);

    this.checkNull(session);

    this.validate(session);

    const storeState = await this.storeStateSrv.get(session.store_id);

    this.processByStoreState(storeState, userId);

    return {
      user_id: userId,
      ...session,
      ...storeState,
    };
  }

  /**
   * - check null
   * - check sessionId coherence
   * - check complete (selective)
   * - check store orderable
   * - renew ttl or close session
   *
   * ### options default
   * - checkComplete: true
   * - checkIdLast: false
   */
  public async getPlaceable(
    payable: Payable,
    options?: CheckOptions,
  ): Promise<Placeable> {
    options = {
      checkComplete: true,
      checkIdLast: false,
      ...options,
    };

    const userId = payable.user_id;

    const session = await this.repo.read(userId);

    this.checkNull(session);

    if (options.checkIdLast === false) {
      this.checkId(session, payable);
    }

    if (options.checkComplete) {
      this.validate(session);
    }

    const storeState = await this.storeStateSrv.get(session.store_id);

    this.processByStoreState(storeState, userId);

    const orderable = {
      user_id: userId,
      ...session,
      ...storeState,
    };

    if (options.checkIdLast) {
      this.checkId(orderable, payable);
    }

    return {
      ...orderable,
      ...payable,
    };
  }

  public async close(userId: UserId): Promise<void>;
  public async close(withUserId: WithUserId): Promise<void>;
  public async close(arg: UserId | WithUserId): Promise<void> {
    const userId = typeof arg === 'string' ? arg : arg.user_id;

    try {
      await this.repo.delete(userId);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  private checkNull(
    session: OrderSession | null,
  ): asserts session is OrderSession {
    if (session === null) {
      throw new NotFoundOrderSessionException();
    }
  }

  /**
   * throw OrderableIdFaultException or OrderSessionIdFaultException
   */
  private checkId(arg: OrderSession | Orderable, payable: Payable): void {
    if (payable.order_session_id !== arg.order_session_id) {
      throw 'store_state_code' in arg
        ? new OrderableSessionIdFaultException(arg)
        : new OrderSessionIdFaultException(arg);
    }
  }

  /**
   * ### incomplete check
   * 오더세션 무결성 체크 (메인메뉴, 선택옵션 등등) \
   * 어느 부분이 미완성인지 IncompleteOrderSessionException 를 던져서 알려줌
   */
  private validate(session: OrderSession): OrderSession {
    // TODO: Implement validation logic
    // throw new IncompleteOrderSessionException({});
    return session;
  }

  /**
   * - renew ttl or close session
   * - check orderable
   */
  private processByStoreState(storeState: StoreState, userId: UserId): void {
    (() => {
      if (this.storeStateSrv.isBusinessActive(storeState)) {
        return this.repo.renewTtl(userId);
      } else {
        return this.close(userId);
      }
    })().catch(e => this.logger.warn(e));

    if (this.storeStateSrv.isOrderable(storeState) === false) {
      throw new NotOpenStoreException(storeState);
    }
  }
}

type CheckOptions = {
  checkComplete?: boolean;
  checkIdLast?: boolean;
};

export class OrderSessionIdFaultException extends BadRequestException {
  constructor(public readonly orderSession: OrderSession) {
    super(''); //
  }
}

export class OrderableSessionIdFaultException extends BadRequestException {
  constructor(public readonly orderable: Orderable) {
    super(''); //
  }
}

export class NotFoundOrderSessionException extends BadRequestException {
  constructor() {
    super();
  }
}

export class NotOpenStoreException extends BadRequestException {
  constructor(public readonly storeState: StoreState) {
    super();
  }
}

export class IncompleteOrderSessionException extends BadRequestException {
  constructor(public readonly incomplete: any) {
    super();
  }
}
