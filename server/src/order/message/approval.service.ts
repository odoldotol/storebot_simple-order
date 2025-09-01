import {
  PaymentSession,
  OrderPlacementSession,
  Orderable
} from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMessageApprovalService {

  public async push(
    orderSession: Orderable,
    orderPlacementSession: OrderPlacementSession,
    orderPaymentSession: PaymentSession,
    pgToken: string,
    nickname: string
  ): Promise<string> {}

  public subscribe() {}
}