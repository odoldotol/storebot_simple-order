import { Injectable } from '@nestjs/common';
import { OrderSession, UserId } from '@type';

@Injectable()
export class OrderSessionRepository {
  public async read(userId: UserId): Promise<OrderSession | null> {
    userId;
    return null;
  }

  public async renewTtl(userId: UserId): Promise<void> {
    userId;
  }

  public async delete(userId: UserId): Promise<void> {
    userId;
  }
}
