import { ApiSpec } from './type';
import { KakaoChatbotSkillOrderController } from '@kakaoChatbotSkill/controller';

// prettier-ignore
export const API_SPEC: ApiSpec<keyof KakaoChatbotSkillOrderController> =

{
  "prefix": "kakao-chatbot-skill/order",
  "place": {
    "method": "POST",
    "path": "place"
  }
}
