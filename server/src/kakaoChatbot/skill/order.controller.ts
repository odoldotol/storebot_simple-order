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
import { OrderApprovalSessionService } from '@orderApprovalSession';
import { API_SPEC } from '@apiSpec/kakaoChatbotSkillOrder.apiSpec';
import { OrderSessionId } from '@type';

@Controller(API_SPEC.prefix)
// @UseGuards - Auth(User)
// @UseInterceptors(TimeoutInterceptor)
// @UseFilters
export class KakaoChatbotSkillOrderController {
  constructor(
    private readonly resOrderBody: KakaoChatbotSkillResponseOrderBody,
    private readonly orderApprovalSessionSrv: OrderApprovalSessionService,
    private readonly orderPlacementSrv: OrderPlacementService,
  ) {}

  @Post(API_SPEC.place.path)
  public async place(
    userId: string, // @Todo - Pipe
    orderSessionId: OrderSessionId, // @Todo - Pipe
  ): Promise<SkillResponseV2> {
    const orderApprovalSession =
      await this.orderApprovalSessionSrv.getSession(userId);
    // @Todo - orderApprovalSession 완성세션이면 거부, 미완성이면 트레이싱해서 처리, 없으면 진행.
    orderApprovalSession;

    const payable = await this.orderPlacementSrv.place(userId, orderSessionId);
    return this.resOrderBody.place(payable);
  }

  // .../session
  // body 에서 addItem, removeItem, addItemOption, ... 동작 명시
  // 스토어가 바뀔때 처리
}
