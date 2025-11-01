import { StoreId } from './id';

/**
 * key: user_id
 */
export type OrderSession = {
  order_session_id: OrderSessionId;
  store_id: StoreId;
  // items
};

/**
 * \<timestamp\>-\<version\> \
 * timestamp: Date.now(); \
 * version: 0 부터 시작해서 수정할때마다 INCR
 *
 * deserialize: id(<timestamp>-<version>) -> { timestamp, version } \
 * timestamp: Number(id.slice(0, 13)) \
 * version: Number(id.slice(14))
 */
export type OrderSessionId = `${number}-${number}`;
