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
import { Payable } from '@type';

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
    // PaymentToken 으로 payable 가져오기 (PaymentSessionService.prototype.getPayable)
    payable = {} as Payable,
    // nickname 가져오기
    nickname = '',
  ) {
    const result = this.orderPlacementApprovalResponseSrv.response(
      payable.user_id,
    );

    await this.orderPlacementService.approve(payable, pgToken, nickname);

    return result;
  }

  @Post(API_SPEC.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(API_SPEC.failByKakaopay.path)
  public failByKakaopay() {}
}
