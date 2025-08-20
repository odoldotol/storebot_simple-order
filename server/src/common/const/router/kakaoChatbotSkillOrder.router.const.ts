import { Router } from './router.type';
import { KakaoChatbotSkillOrderController } from '@kakaoChatbotSkill';

export const kakaoChatbotSkillOrderRouter: Router<keyof KakaoChatbotSkillOrderController> =
{
  "prefix": "kakao-chatbot-skill/order",
  "routes": {
    "place": {
      "method": "POST",
      "path": "place"
    }
  }
}