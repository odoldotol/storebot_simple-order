import { Injectable } from '@nestjs/common';
import { KakaoChatbotSkillOrderController } from '../order.controller';
import { ResponseBody } from './interface';
import { SkillResponseV2 } from './type';

@Injectable()
export class KakaoChatbotSkillResponseOrderBody
  implements ResponseBody<KakaoChatbotSkillOrderController>
{
  constructor() {}

  public checkOrderSession(): SkillResponseV2 {
    return {};
  }

  public placeOrder(): SkillResponseV2 {
    return {};
  }

}
