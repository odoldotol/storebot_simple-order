/**
 * \<timestamp\>-\<version\>  
 * timestamp: Date.now();  
 * version: 0 부터 시작해서 수정할때마다 INCR  
 *
 * deserialize: id(<timestamp>-<version>) -> { timestamp, version }  
 * timestamp: Number(id.slice(0, 13))  
 * version: Number(id.slice(14))  
 */
export type OrderSessionId = `${number}-${number}`;
export type OrderId = Uuid;
export type UserId = Uuid;

export type WithUserId = {
  user_id: UserId;
};

export type Uuid = string;
export type Url = string;

export type PaymentToken = Url;

/**
 * key: user_id
 */
export type PaymentSession = {
  order_id: OrderId;
  order_session_id: OrderSessionId;
  tid: string;
  redirect: Redirect;
  payment_token: PaymentToken; // to destroy
};

export type Payable = PaymentSession & WithUserId;

/**
 * key: user_id
 */
export type OrderSession = {
  order_session_id: OrderSessionId;
  store_id: StoreId;
  // items
};

export type Orderable = OrderSession & WithUserId & StoreState;

export type StoreState = {
  business_id: BusinessId;
  store_state_code: StoreStateCode;
  store_open_time?: number; // timestamp
  store_break_time?: number; // timestamp
  store_resumed_time?: number; // timestamp
  store_close_time?: number; // timestamp
};

export type Placeable = Orderable & Payable;

/**
 * Orderable 관점에서 0 은 ORDERABLE 이외 음수는 ENDED, 양수는 PAUSED  
 * Business 관점에서 음수는 INACTIVE, 그외는 ACTIVE  
 */
export const enum StoreStateCode {
  CLOSED = -2,
  CLOSING,
  OPEN,
  PREPARING,
  BREAK,
}

export type Redirect = {
  next_redirect_app_url: Url;
  next_redirect_mobile_url: Url;
  next_redirect_pc_url: Url;
  android_app_scheme: string;
  ios_app_scheme: string;
};

export type StoreId = number;
export type BusinessId = number;