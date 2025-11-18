import { Url } from './url.type';
import { OrderId } from './id';
import { OrderSessionId } from './orderSession.type';

/**
 * key: user_id
 */
export type PaymentSession = {
  order_id: OrderId;
  order_session_id: OrderSessionId;
  tid: string;
  redirect: Redirect;
};

export type Redirect = {
  next_redirect_app_url: Url;
  next_redirect_mobile_url: Url;
  next_redirect_pc_url: Url;
  android_app_scheme: string;
  ios_app_scheme: string;
};
