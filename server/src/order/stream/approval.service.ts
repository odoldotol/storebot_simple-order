import { OrderPaymentSession, OrderPlacementSession, OrderSession } from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderStreamApprovalService {

  public async push(
    orderSession: OrderSession,
    orderPlacementSession: OrderPlacementSession,
    orderPaymentSession: OrderPaymentSession
  ): Promise<void> {}

  public subscribe() {}
}