import {
  Controller,
  // HttpCode,
  // HttpStatus,
  Post,
} from '@nestjs/common';
import {
  OrderPlacementApprovalResponseService,
  OrderPlacementService,
} from '../provider';
import { API_SPEC } from '@apiSpec/orderPlacement.apiSpec';
import { OrderId, UserId } from '@type';

@Controller(API_SPEC.prefix)
export class OrderPlacementController {
  constructor(
    private readonly orderPlacementService: OrderPlacementService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
  ) {}

  @Post(API_SPEC.approveByKakaopay.path)
  public async approveByKakaopay(
    // 파라미터 및 쿼리스트링에서 PaymentToken, pgToken 추출하기
    pgToken = '',
    // PaymentToken 으로 orderId, userId 추출하기 (PaymentSessionTokenService.prototype.getIds)
    orderId = '' as OrderId,
    userId = '' as UserId,
  ) {
    const result = this.orderPlacementApprovalResponseSrv.response(userId);

    await this.orderPlacementService.approve(userId, orderId, pgToken);

    return result;
  }

  @Post(API_SPEC.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(API_SPEC.failByKakaopay.path)
  public failByKakaopay() {}
}
