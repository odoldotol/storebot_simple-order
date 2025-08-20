# Logic & System

```
AWS RDS
  Postgres 인스턴스 1개
AWS EC2 (PFA 인스턴스) (싱글코어 싱글스레드)
  Nginx 1개
  nodeJS 앱 1개 프로세스 1개
  Redis 2개
```

<br><br>

## System
![system](https://storage.googleapis.com/odoldotol-image-store/simpleorder_system.jpeg)

### Store Client
single process, single thread

### Streaming
```
redis stream --- rxjs --- socket.io
                      --- services
```


<br><br>

## Login Store

[more](./server/logic/store/auth/auth.login)

<br><br>

## Ready Store
![store_ready](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_ready.png)

[more](./server/logic/store/store.status/store.status.ready)

<br><br>

## Open Store
![store_open](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_open.png)

- Day Business State 변경

<br><br>

## Search Store
![search_store](https://storage.googleapis.com/odoldotol-image-store/simpleorder_search_store.png)

<br><br>

## Get Menu
![get_menu](https://storage.googleapis.com/odoldotol-image-store/simpleorder_get_menu.png)

<br><br>

## Order Session
![make_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_make_order.png)

<br><br>

## Place Order
![place_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_place_order.jpeg)

[order consistency](./server/logic/order.consistency)
[detail](./server/logic/customer/order.place.v2)  

<br><br>

## Alert Order Ready
![alert_order_ready](https://storage.googleapis.com/odoldotol-image-store/simpleorder_alert_order_ready.png)

Alert Order Ready 스트림 사용

<br><br>

## Cancel Order

Store Client

<br><br>

## Get Order
![get_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_get_order.png)

ordering 의 각 CREATE, UPDATE  
그리고 get order 의 SELECT  
그리고 accouning batch 의 SELECT, UPDATE  
가 교착? 경쟁? 하지 않도록 설계함

<br><br>

## Close Store
![store_close](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_close.png)

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