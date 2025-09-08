import { Router } from './router.type';
import { OrderPlacementController } from '@order/placement';

// prettier-ignore
export const orderPlacementRouter: Router<keyof OrderPlacementController> =
{
  "prefix": "order/placement",
  "routes": {
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
}
