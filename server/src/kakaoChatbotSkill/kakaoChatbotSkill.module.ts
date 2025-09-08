import { Module } from '@nestjs/common';
import { OrderPlacementModule } from '@order/placement';
import { KakaoChatbotSkillOrderController } from './order.controller';
import { KakaoChatbotSkillResponseOrderBody } from './skillResponse';

@Module({
  imports: [OrderPlacementModule],
  controllers: [KakaoChatbotSkillOrderController],
  providers: [KakaoChatbotSkillResponseOrderBody],
})
export class KakaoChatbotSkillModule {}
