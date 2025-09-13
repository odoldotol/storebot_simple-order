import { Router } from './router.type';
import { KakaoChatbotSkillOrderController } from '@kakaoChatbot/skill/order.controller';

// prettier-ignore
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
