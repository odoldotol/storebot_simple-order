import { ApiSpec } from './type';
import { PaymentCallbackGatewayController } from '@paymentCallbackGateway/controller';

// prettier-ignore
export const API_SPEC: ApiSpec<keyof PaymentCallbackGatewayController> =

{
  "prefix": "payment/callback",
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
