import { Injectable } from '@nestjs/common';
import { OrderId, UserId } from '@type';

@Injectable()
export class OrderApprovalSessionService {
  public async start(
    userId: UserId,
    orderId: OrderId,
    orderApprovalMessageId: string,
  ): Promise<void> {
    userId;
    orderId;
    orderApprovalMessageId;
  }

  public async getSession(userId: UserId): Promise<any> {
    userId;
  }
}
