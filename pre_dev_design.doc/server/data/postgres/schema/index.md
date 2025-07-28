# Store

### store

### store_auth

### store_location
- 저장된 매장 위치정보중 특정 좌표 근처에 있는 매장들을 찾는것
- 위치정보들을 관리것

종합적으로 NoSQL 이 유리한가?


## Day Business

### day_business

### day_business_history


## Accounting

### accounting_day_business

### accounting_order



## menu
- 점포에서 만든 메뉴를 고객들이 조회하기위한 것
- 점포에서 메뉴수정 편의성 고려

읽기 성능 위주 디자인

### menu_category

### menu_item

### menu_item_option

### menu_selection

### menu_item_option_category


### menu_category__item

### menu_item__item_option

### menu_item__selection

### menu_item__item_option_category

### menu_selection__item_option

### menu_item_option_category__item_option




# User





# Order
- 주문 의 placement 와 기록.
- 주문의 관리와 확인.

INDEX
- 고객입장에서 주문의 조회.


### order
### order_payment
### order_history

### order_item
### order_item__item_option

### order_discount
### order_item_discount
### order_item_option_discount

### order_memo
