import {
  Controller,
  // HttpCode,
  // HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymentApprovalCallbackResponseService } from '../provider/approvalResponse.service';
import { OrderApprovalSessionService } from '@orderApprovalSession';
import { OrderPlacementService } from '@orderPlacement';
import { API_SPEC } from '@apiSpec/paymentCallbackGateway.apiSpec';
import { OrderId, UserId } from '@type';

@Controller(API_SPEC.prefix)
export class PaymentCallbackGatewayController {
  constructor(
    private readonly paymentApprovalCallbackResponseSrv: PaymentApprovalCallbackResponseService,
    private readonly orderApprovalSessionSrv: OrderApprovalSessionService,
    private readonly orderPlacementSrv: OrderPlacementService,
  ) {}

  // @UseGuards - payableToken 추출, PayableToken 으로 userId, orderId 추출 (PayableTokenService) GETDEL
  // @UseInterceptors(TimeoutInterceptor)
  // @UseFilters
  @Post(API_SPEC.approveByKakaopay.path)
  public async approveByKakaopay(
    @Res() response: Response,
    // @Todo - pipe
    pgToken = '',
    userId = '' as UserId,
    orderId = '' as OrderId,
  ) {
    this.paymentApprovalCallbackResponseSrv.setResponse(userId, response);

    let id: string;
    try {
      await this.orderApprovalSessionSrv.ready(userId, orderId);
      id = await this.orderPlacementSrv.approve(pgToken, userId, orderId);
    } catch (error) {
      // @Todo - orderApprovalSession 삭제, 실패 응답
      return;
    }

    await this.orderApprovalSessionSrv.start(userId, id);
  }

  @Post(API_SPEC.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(API_SPEC.failByKakaopay.path)
  public failByKakaopay() {}
}
