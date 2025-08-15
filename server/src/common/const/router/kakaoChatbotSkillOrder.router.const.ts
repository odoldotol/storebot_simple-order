import { Router } from './router.type';
import { KakaoChatbotSkillOrderController } from '@kakaoChatbotSkill';

export const kakaoChatbotSkillOrderRouter: Router<keyof KakaoChatbotSkillOrderController> =
{
  "prefix": "kakao-chatbot-skill/order",
  "routes": {
    "checkOrderSession": {
      "method": "POST",
      "path": "session/check"
    },
    "placeOrder": {
      "method": "POST",
      "path": "place"
    }
  }
}