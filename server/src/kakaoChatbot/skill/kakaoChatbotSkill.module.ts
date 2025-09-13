import { KakaoChatbotSkillModule } from '@modules';
import { KakaoChatbotSkillOrderController } from './order.controller';
import { KakaoChatbotSkillResponseOrderBody } from './skillResponse';

KakaoChatbotSkillModule.controllers = [KakaoChatbotSkillOrderController];
KakaoChatbotSkillModule.providers = [KakaoChatbotSkillResponseOrderBody];
