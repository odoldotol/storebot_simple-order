// // 읽기전용

// // key: user_id

// // value
// type OrderSession = {
//   id: OrderSessionId;
//   order_id: uuid | null;

//   user_id: uuid;

//   store_id: uuid;
//   day_business_id: uuid;

//   user_info: UserInfo; // ?

//   store_summary: StoreSummary; // ?

//   order_items: OrderItem[];

//   discounts: Discount[];

//   memo: OrderMemo;

//   total_amount: number;

//   payment: OrderPayment;

//   history: OrderHistory[];
// }

// /**
//  * \<timestamp\>-\<version\>  
//  * timestamp: Date.now();  
//  * version: 0 부터 시작해서 수정할때마다 INCR  
//  *
//  * deserialize: id(<timestamp>-<version>) -> { timestamp, version }  
//  * timestamp: Number(id.slice(0, 13))  
//  * version: Number(id.slice(14))  
//  */
// type OrderSessionId = string;

// type uuid = string;

// type UserInfo = {};

// type StoreSummary = {};

// type OrderItem = {
//   item_id: uuid;
//   item_name: string;
//   item_amount: number;
//   item_quantity: number;
//   item_total_amount: number;
//   item_discounts: Discount[];
//   item_options: ItemOption[];
// };

// type Discount = {};

// type ItemOption = {
//   item_option_id: string;
//   item_option_discounts: Discount[];
// };

// type OrderMemo = {};

// type OrderPayment = {
//   tid: string;
// };

// type OrderHistory = {};