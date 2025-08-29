import {
  OrderPaymentSession,
  OrderPlacementSession,
  OrderSession
} from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMessageApprovalService {

  public async push(
    orderSession: OrderSession,
    orderPlacementSession: OrderPlacementSession,
    orderPaymentSession: OrderPaymentSession,
    pgToken: string,
    nickname: string
  ): Promise<string> {}

  public subscribe() {}
}