import { Injectable } from '@nestjs/common';
import { OrderId, UserId } from '@type';

@Injectable()
export class OrderApprovalSessionService {
  public async ready(userId: UserId, orderId: OrderId): Promise<void> {
    userId;
    orderId;
  }

  public async start(
    userId: UserId,
    orderApprovalMessageId: string,
  ): Promise<void> {
    userId;
    orderApprovalMessageId;
  }

  public async getSession(userId: UserId): Promise<any> {
    userId;
  }
}
