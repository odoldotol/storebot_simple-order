import { Injectable } from '@nestjs/common';
import { OrderSession, UserId } from '@type';

@Injectable()
export class OrderSessionRepository {
  /**
   * renew ttl
   */
  public async read(userId: UserId): Promise<OrderSession | null> {
    userId;
    return null;
  }

  public async renewTtl(userId: UserId): Promise<boolean> {
    userId;
    return true;
  }

  public async delete(userId: UserId): Promise<boolean> {
    userId;
    return true;
  }
}
