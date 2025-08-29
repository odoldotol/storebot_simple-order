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

export type OrderPlacementSession = {
  order_session_id: OrderSessionId;
  order_id: OrderId;
}

export type Uuid = string;
export type Url = string;

export type OrderPaymentSession = {
  order_session_id: OrderSessionId;
  tid: string;
  redirect: Redirect;
  order_payment_token: Url;
};

export type OrderSession = {
  order_session_id: OrderSessionId;
  store_id: StoreId;
  day_business_id: DayBusinessId;
};

export type Redirect = {
  next_redirect_app_url: Url;
  next_redirect_mobile_url: Url;
  next_redirect_pc_url: Url;
  android_app_scheme: string;
  ios_app_scheme: string;
};

export type StoreId = number;
export type DayBusinessId = number;