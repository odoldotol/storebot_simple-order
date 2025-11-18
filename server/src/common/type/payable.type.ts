import { PaymentSession } from './paymentSession.type';
import { Base64url } from './base64url.type';
import { UserId } from './id';
import { OrderSession } from './orderSession.type';

export type Payable = OrderSession &
  PaymentSession & {
    user_id: UserId;
  };

export type PayableToken = Base64url;
