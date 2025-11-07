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
import { OrderPlacementService } from '@orderPlacement';
import { API_SPEC } from '@apiSpec/kakaoChatbotSkillOrder.apiSpec';

@Controller(API_SPEC.prefix)
// @UseGuards - Auth(User)
// @UseInterceptors(TimeoutInterceptor)
// @UseFilters
export class KakaoChatbotSkillOrderController {
  constructor(
    private readonly resOrderBody: KakaoChatbotSkillResponseOrderBody,
    private readonly orderPlacementSrv: OrderPlacementService,
  ) {}

  @Post(API_SPEC.place.path)
  public async place(
    userId: string, // @Todo - Pipe
  ): Promise<SkillResponseV2> {
    const payable = await this.orderPlacementSrv.place(userId);
    return this.resOrderBody.place(payable);
  }

  // .../session
  // body 에서 addItem, removeItem, addItemOption, ... 동작 명시
  // 스토어가 바뀔때 처리
}
