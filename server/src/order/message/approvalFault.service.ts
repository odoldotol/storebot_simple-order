import { UserId } from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMessageApprovalFaultService {
  public async push(
    userId: UserId,
    error: any
  ) {
    userId;
    error;
  }
}