import { Injectable } from '@nestjs/common';
import { UserId } from '@type';

@Injectable()
export class OrderMessageApprovalFaultService {
  public async push(userId: UserId, error: any) {
    userId;
    error;
  }
}
