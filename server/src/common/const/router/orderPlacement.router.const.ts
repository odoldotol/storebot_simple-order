import { Router } from './router.type';
import { OrderPlacementController } from '@order/placement';

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