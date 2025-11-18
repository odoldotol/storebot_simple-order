import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserId } from '@type';

/**
 * @Todo OrderPlaced Message, OrderApprovalFault Message 구독하고 처리해야함
 */
@Injectable()
export class PaymentApprovalCallbackResponseService {
  private readonly map = new Map<
    UserId,
    Response<PaymentApprovalCallbackResponseBody>
  >(); // PaymentApprovalCallbackResponseMap

  public setResponse(
    userId: UserId,
    response: Response<PaymentApprovalCallbackResponseBody>,
  ): PaymentApprovalCallbackResponseBody {
    if (this.map.has(userId)) {
      // @Todo - 처리되지 않은 응답 에러처리
      this.map.get(userId)!.status(500).json('new response error!');
    }

    this.map.set(userId, response);
  }
}

/**
 * @Todo impl
 */
type PaymentApprovalCallbackResponseBody = any;
