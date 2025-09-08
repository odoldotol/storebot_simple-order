import {
  Controller,
  // HttpCode,
  // HttpStatus,
  Post,
} from '@nestjs/common';
import {
  KakaoChatbotSkillResponseOrderBody,
  SkillResponseV2,
} from './skillResponse';
import { OrderPlacementService } from '@order/placement';
import { kakaoChatbotSkillOrderRouter } from '@common/const';

@Controller(kakaoChatbotSkillOrderRouter.prefix)
// @UseGuards
// @UseInterceptors(TimeoutInterceptor)
// @UseFilters
export class KakaoChatbotSkillOrderController {
  constructor(
    private readonly resOrderBody: KakaoChatbotSkillResponseOrderBody,
    private readonly orderPlacementSrv: OrderPlacementService,
  ) {}

  @Post(kakaoChatbotSkillOrderRouter.routes.place.path)
  public async place(
    userId: string, // @Todo - Pipe
  ): Promise<SkillResponseV2> {
    await this.orderPlacementSrv.place(userId);
    return this.resOrderBody.place();
  }

  // .../session
  // body 에서 addItem, removeItem, addItemOption, ... 동작 명시
  // 스토어가 바뀔때 처리
}
