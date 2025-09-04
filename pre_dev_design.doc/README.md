<br>

Code is the most up-to-date. Documents probably outdated.

<br>

## System

![system](https://storage.googleapis.com/odoldotol-image-store/simpleorder_system.png)

### Customer Client
Kakaotalk Channel Chatbot

<br>

### Store Client
single process, single thread  
Web Browser

<br>

### Server
Event Driven Architecture  
Monolithic Architecture considering migration to MSA.

Nestjs  

<br>

### DBMS
Postgres

<br>

### Message Broker
Redis Stream

<br>

### Cache, Session Storage
Redis

<br>

### Payment Gateway
KakaoPay

<br><br>

## Login Store

[more](./server/logic/store/auth/auth.login)

<br><br>

## Ready Store
<!-- ![store_ready](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_ready.png) -->

[more](./server/logic/store/store.status/store.status.ready)

<br><br>

## Open Store
<!-- ![store_open](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_open.png) -->

<br><br>

## Search Store
<!-- ![search_store](https://storage.googleapis.com/odoldotol-image-store/simpleorder_search_store.png) -->

<br><br>

## Get Menu
<!-- ![get_menu](https://storage.googleapis.com/odoldotol-image-store/simpleorder_get_menu.png) -->

<br><br>

## Order Session
<!-- ![make_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_make_order.png) -->

<br><br>

## Place Order

### Place Order

![place_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_place_order.png)

```
Store State (Mutable, Redis Hash) - 1:store

Order Session (Mutable, Redis JSON) - 1:user
  order_Session_id (millisecondsTime, sequenceNumber)
  store_id
  items

order_id (uuid v7) - primary key
payment_token (OpaqueToken, base64url) - 1:user

Payment Session (Immutable, Redis String) - 1:user
	order_id
	order_Session_id
  tid (kakaopay)
  redirect (payment_token)
```

<br>

### Approve Order Placement

![approve_order_placement](https://storage.googleapis.com/odoldotol-image-store/simpleorder_approve_order_placement.png)

```
Response - Linking HTTP request context to consumer context 

Order Approval Message
  Order Session
  Payment Session
  Store State
  Nickname
```

```
On Order Approval Message
  Approve Kakaopay Payment
  Create Order Aggregate
  Message (Store, Order Placed)
```

<br>

[order_consistency](./server/logic/order.consistency)  
[detail](./server/logic/customer/order.place.v2)  

<br><br>

## Alert
<!-- ![alert_order_ready](https://storage.googleapis.com/odoldotol-image-store/simpleorder_alert_order_ready.png) -->

<br><br>

## Cancel Order

Store Client

<br><br>

## Get Order
<!-- ![get_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_get_order.png) -->

Considering CQRS

<br><br>

## Close Store
<!-- ![store_close](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_close.png) -->

주문정합성검사 (client, stream)  
accounting queue 에 day_business_id, 마감시간정보 등 담긴 객체 푸시  
StoreDayBusinessState 제거

(추가) day_business 에 영업 실적같은 간략 정보 업데이트

<br><br>

## Accounting Batch

스트림 제거할때 Order StreamKey StreamId 캐시에서 Order 들도 제거해야함

<br><br>

## Order Batch

<br><br>

## Settlement

정산 시스템은 추후 디자인 해야할것같음

<br><br><br><br>

# Entity

<br><br>

## RDB

<br><br>

## Stream

<br><br>

## Cache

<br><br>

## Session

<br><br><br><br>

# Server API

<br><br>

## Customer
KakaoChatbotSkill 모듈이 FE 역할과 유사

<br><br>


<br><br>

## Store

### Admin

### Business

#### Ready Store

#### Open Store

#### Break Store

#### Reopen Store

#### Closing Store

#### Close Store

#### Order Cancel