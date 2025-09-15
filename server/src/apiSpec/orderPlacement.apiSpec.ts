import { ApiSpec } from './type';
import { OrderPlacementController } from '@orderPlacement/controller';

// prettier-ignore
export const API_SPEC: ApiSpec<keyof OrderPlacementController> =

{
  "prefix": "order/placement",
  "approveByKakaopay": {
    "method": "POST",
    "path": "approval/kakaopay"
  },
  "cancelByKakaopay": {
    "method": "POST",
    "path": "cancel/kakaopay"
  },
  "failByKakaopay": {
    "method": "POST",
    "path": "fail/kakaopay"
  }
}
