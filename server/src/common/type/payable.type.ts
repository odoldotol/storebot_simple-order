import { HasUserId } from './hasUserId.type';
import { PaymentSession } from './paymentSession.type';

export type Payable = PaymentSession & HasUserId;
