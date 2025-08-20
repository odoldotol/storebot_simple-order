// key: user_id

// value
type OrderSession = {
  id: OrderSessionId;

  // user_id: uuid;

  store_id: uuid;

  order_items: OrderItem[];

  discounts: Discount[];

  memo: OrderMemo;
}

/**
 * \<timestamp\>-\<version\>  
 * timestamp: Date.now();  
 * version: 0 부터 시작해서 수정할때마다 INCR  
 *
 * deserialize: id(<timestamp>-<version>) -> { timestamp, version }  
 * timestamp: Number(id.slice(0, 13))  
 * version: Number(id.slice(14))  
 */
type OrderSessionId = string;

type uuid = string;

type OrderItem = {
  item_id: uuid;
  item_name: string;
  item_amount: number;
  item_quantity: number;
  item_discounts: Discount[];
  item_options: ItemOption[];
};

type Discount = {};

type ItemOption = {
  item_option_id: string;
  item_option_discounts: Discount[];
};

type OrderMemo = {};