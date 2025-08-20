import { Injectable } from '@nestjs/common';
import {
  OrderSession,
  OrderSessionId,
  UserId
} from '@common/type';

@Injectable()
export class OrderSessionService {

  constructor(
    private readonly orderSessionRepo: OrderSessionRepository
  ) {}

  public async getWithRenewTtl(userId: UserId): Promise<OrderSession | null> {
    const session = await this.get(userId);

    if (session === null) {
      return null;
    }

    this.renewTtl(userId);

    return session;
  }

  /**
   * 없으면 session 자체가 없는건지 Id 만 없는건지 확인  
   * 세션 자체가 없으면 주문세션없음 에러 던지기.  
   * Id 만 없는거면 세션 전체 날려버리고 에러 던지기.  
   */
  public getSessionId(userId: UserId): Promise<string> {
    return Promise.resolve(`${Date.now()}-0`);
  }

  public isSame(
    sessionA: { order_session_id: OrderSessionId },
    sessionB: { order_session_id: OrderSessionId },
    sessionC?: { order_session_id: OrderSessionId }
  ): boolean {
    return sessionA.order_session_id === sessionB.order_session_id && (!sessionC || sessionA.order_session_id === sessionC.order_session_id);
  }

  public get(userId: UserId): Promise<OrderSession | null> {
    return this.orderSessionRepo.get(userId);
  }

  private renewTtl(userId: UserId): Promise<void> {
    return Promise.resolve();
  }
}
