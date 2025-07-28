type OrderSession = {
  user_id: uuid; // key
  user_info: UserInfo; // ?

  store_id: uuid;
  store_summary: StoreSummary; // ?

  day_business_id: uuid;

  order_id: uuid | null;

  order_items: OrderItem[];

  discounts: Discount[];

  memo: OrderMemo;

  total_amount: number;

  payment: OrderPayment;

  history: OrderHistory[];
}

type uuid = string;

type UserInfo = {};

type StoreSummary = {};

type OrderItem = {
  item_id: uuid;
  item_name: string;
  item_amount: number;
  item_quantity: number;
  item_total_amount: number;
  item_discounts: Discount[];
  item_options: ItemOption[];
};

type Discount = {};

type ItemOption = {
  item_option_id: string;
  item_option_discounts: Discount[];
};

type OrderMemo = {};

type OrderPayment = {
  tid: string;
};

type OrderHistory = {};