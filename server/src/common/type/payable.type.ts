import { Orderable } from './orderable.type';
import { PaymentSession } from './paymentSession.type';

export type Payable = Orderable & PaymentSession;
