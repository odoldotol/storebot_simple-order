import { HasUserId } from './hasUserId.type';
import { OrderSession } from './orderSession.type';
import { StoreState } from './storeState.type';

export type Orderable = OrderSession & HasUserId & StoreState;
