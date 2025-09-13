import {
  Controller,
  // HttpCode,
  // HttpStatus,
  Post,
} from '@nestjs/common';
import {
  OrderPlacementApprovalResponseService,
  OrderPlacementService,
} from '@order/placement/provider';
import { orderPlacementRouter } from '@common/const';
import { Payable } from '@common/type';

@Controller(orderPlacementRouter.prefix)
export class OrderPlacementController {
  constructor(
    private readonly orderPlacementService: OrderPlacementService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
  ) {}

  @Post(orderPlacementRouter.routes.approveByKakaopay.path)
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

  @Post(orderPlacementRouter.routes.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(orderPlacementRouter.routes.failByKakaopay.path)
  public failByKakaopay() {}
}
