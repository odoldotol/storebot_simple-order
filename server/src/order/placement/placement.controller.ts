import {
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { OrderPlacementService } from './placement.service';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import { OrderMessageApprovalFaultService } from '@order/message';
import { orderPlacementRouter } from '@common/const';

@Controller(orderPlacementRouter.prefix)
export class OrderPlacementController {

  constructor(
    private readonly orderPlacementService: OrderPlacementService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
    private readonly orderMessageApprovalFaultSrv: OrderMessageApprovalFaultService
  ) {}

  @Post(orderPlacementRouter.routes.approveByKakaopay.path)
  public approveByKakaopay() {
    // 파라미터 및 쿼리스트링에서 PaymentToken, pgToken 추출하기
    // PaymentToken 으로 userId 가져오기
    // nickname 가져오기
    const
    pgToken = "",
    userId = "",
    nickname = "";

    const result = this.orderPlacementApprovalResponseSrv.response(userId);

    this.orderPlacementService.approve(userId, pgToken, nickname)
    .catch(error => this.orderMessageApprovalFaultSrv.push(userId, error))
    .catch(error => this.orderPlacementApprovalResponseSrv.error(userId, error));

    return result;
  }

  @Post(orderPlacementRouter.routes.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(orderPlacementRouter.routes.failByKakaopay.path)
  public failByKakaopay() {}

}
