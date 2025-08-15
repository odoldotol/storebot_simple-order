import {
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { kakaoChatbotSkillOrderRouter } from '@common/const';
import {
  KakaoChatbotSkillResponseOrderBody,
  SkillResponseV2
} from './skillResponse';

@Controller(kakaoChatbotSkillOrderRouter.prefix)
// @UseGuards
// @UseInterceptors(TimeoutInterceptor)
// @UseFilters
export class KakaoChatbotSkillOrderController {

  constructor(
    private readonly resOrderBody: KakaoChatbotSkillResponseOrderBody
  ) {}

  @Post(kakaoChatbotSkillOrderRouter.routes.checkOrderSession.path)
  @HttpCode(HttpStatus.OK)
  public checkOrderSession(): Promise<SkillResponseV2> {
    return Promise.resolve(this.resOrderBody.checkOrderSession());
  }

  @Post(kakaoChatbotSkillOrderRouter.routes.placeOrder.path)
  public placeOrder(): Promise<SkillResponseV2> {
    return Promise.resolve(this.resOrderBody.placeOrder());
  }
}
