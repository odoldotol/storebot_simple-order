// 읽기전용

/*
이 도큐먼트의 목적은 메뉴의 읽기 캐싱에 있음
캐시 업데이트는 어드민점포가 메뉴를 수정했을때 비동기적으로 일어남.
유저만 이 캐시를 읽는데,
유저 입장에서는 메뉴를 고르면서 주문서를 구성하는 도중에 메뉴의 수정이 일어나면 안됨.
간단하게, 카카오챗봇스킬 요청/응답 바디에 이 메뉴도큐먼트를 포함할것임.
허나, 메뉴를 고르는 과정에서 http 요청/응답 바디가 무거워지는 단점이 있음.
카카오스킬 컨텍스트 사용해서 바디를 최대한 줄여보자

때문에, 도큐먼트를 서버에서 읽을때마다 약간의 재구성 연산 오버헤드가 있더라도 바디를 좀 가볍게 하기위해 도큐먼트를 디자인할것임.
*/

type MenuDocument = {
  store_id: string; // key
  categories: MenuDocumentCategory[];
  items: MenuDocumentItem[];
  item_options: MenuDocumentItemOption[];
  item_option_categories: MenuDocumentItemOptionCategory[];
  item_option_selections: MenuDocumentItemOptionSelection[];
};

type MenuDocumentCategory = {
  name: string;
  item_indexes: number[];
};

type MenuDocumentItem = {
  item_id: string;
  image_url: Url;
  name: string;
  price: number;
  is_main: boolean;
  option_indexes: number[];
  selection_indexes: number[];
  option_category_indexes: number[];
};

type MenuDocumentItemOptionSelection = {
  name: string;
  min: number;
  max: number;
  option_indexes: number[];
};

type MenuDocumentItemOptionCategory = {
  name: string;
  option_indexes: number[];
};

type MenuDocumentItemOption = {
  item_option_id: string;
  name: string;
  price: number;
};

type Url = string;