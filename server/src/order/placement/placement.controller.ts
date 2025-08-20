import {
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { orderPlacementRouter } from '@common/const';

@Controller(orderPlacementRouter.prefix)
export class OrderPlacementController {

  @Post(orderPlacementRouter.routes.approveByKakaopay.path)
  public approveByKakaopay() {}

  @Post(orderPlacementRouter.routes.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(orderPlacementRouter.routes.failByKakaopay.path)
  public failByKakaopay() {}

}
