import {
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { OrderPlacementService } from './placement.service';
import { orderPlacementRouter } from '@common/const';

@Controller(orderPlacementRouter.prefix)
export class OrderPlacementController {

  constructor(
    private readonly orderPlacementService: OrderPlacementService
  ) {}

  @Post(orderPlacementRouter.routes.approveByKakaopay.path)
  public approveByKakaopay() {
    // 파라미터 및 쿼리스트링에서 PaymentToken, pgToken 추출하기
    // PaymentToken 으로 userId 가져오기
    // nickname 가져오기
    this.orderPlacementService.approve(userId, pgToken, nickname);
  }

  @Post(orderPlacementRouter.routes.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(orderPlacementRouter.routes.failByKakaopay.path)
  public failByKakaopay() {}

}
