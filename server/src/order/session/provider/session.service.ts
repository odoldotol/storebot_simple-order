import { Injectable } from '@nestjs/common';
import { Loggable } from '@logger';
import { OrderSessionRepository } from './session.repository';
import { StoreStateService } from '@storeState';
import {
  Orderable,
  OrderSession,
  Payable,
  PaymentSession,
  StoreState,
  UserId,
} from '@type';
import {
  NotFoundOrderSessionException,
  NotOpenStoreException,
  OrderableSessionIdFaultException,
  OrderSessionIdFaultException,
} from '@exception';

@Injectable()
export class OrderSessionService extends Loggable {
  constructor(
    private readonly repo: OrderSessionRepository,
    private readonly storeStateSrv: StoreStateService,
  ) {
    super();
  }

  /**
   * throw NotFoundOrderSessionException if null
   */
  public async getSession(userId: UserId): Promise<OrderSession> {
    const session = await this.repo.read(userId);

    this.checkNull(session);

    return session;
  }

  /**
   * @Todo implement
   */
  public addItem(): void {}

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
  public async getPayable(
    userId: UserId,
    paymentSession: PaymentSession,
    options?: CheckOptions,
  ): Promise<Payable> {
    options = {
      checkComplete: true,
      checkIdLast: false,
      ...options,
    };

    const session = await this.repo.read(userId);

    this.checkNull(session);

    if (options.checkIdLast === false) {
      this.checkId(session, paymentSession);
    }

    if (options.checkComplete) {
      this.validate(session);
    }

    const storeState = await this.storeStateSrv.get(session.store_id);

    this.processByStoreState(storeState, userId);

    const orderable = {
      ...session,
      ...storeState,
    };

    if (options.checkIdLast) {
      this.checkId(orderable, paymentSession);
    }

    return {
      ...orderable,
      ...paymentSession,
    };
  }

  public async close(userId: UserId): Promise<void> {
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
  private checkId(arg: OrderSession | Orderable, paymentSession: PaymentSession): void {
    if (paymentSession.order_session_id !== arg.order_session_id) {
      throw 'state_code' in arg
        ? new OrderableSessionIdFaultException(arg)
        : new OrderSessionIdFaultException(arg);
    }
  }

  /**
   * ### incomplete check
   * 오더세션 무결성 체크 (메인메뉴, 선택옵션 등등) \
   * 어느 부분이 미완성인지 IncompleteOrderSessionException 를 던져서 알려줌
   */
  private validate(session: OrderSession): void {
    session; // TODO: Implement validation logic
    // throw new IncompleteOrderSessionException({});
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
