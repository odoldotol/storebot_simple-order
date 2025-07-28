### 이 폴더에서의 목적.

1. Simple Order 의 시스템을 디자인하는 것.
2. 개발 전, Simple Order 필수 기능에 대한 기술적인 문제를 전부 탐구 및 제거해 두는 것.
3. 발생 가능한 기술적인 이슈를 최대한 예상해보는 것.

<br>

---
---

<br><br><br><br>

# Logic & System

<br><br>

## System
![system](https://storage.googleapis.com/odoldotol-image-store/simpleorder_system.png)

### Store Client
single process, single thread

### Streaming
```
redis stream --- rxjs --- socket.io
                      --- services
```


<br><br>

## Login Store

admin login 만 다룸  
[more](./server/logic/store/auth/login)

```
login admin session
  - 세션에 로그인 확인, 있으면 거절
    - 없으면 Store record 읽기
      - 등록된 기기인지, 위치정보 근사한지
        - 세션 생성, 기기 주소, 위치정보 기록

          connect admin order socket
          - 세션에 소켓ID 확인
            - 없으면 소켓 연결, 세션에 소켓ID 기록
```

<br><br>

## Ready Store
![store_ready](https://storage.googleapis.com/odoldotol-image-store/simpleorder_store_ready.png)

### Store Client
```
[Send HTTP REQ Server] Ready Store {store_id} 블로킹, 동기식
```

### Server
```
[Receive HTTP REQ StoreClient] Ready Store {store_id}
- Store Admin Auth
  - generate stream_key, 존재하지 않음 확인, XADD Ready message(Stream 생성)
    - Day Business State 생성
      - Day Business Record 생성
        - admin 소켓 찾기
          - admin 소켓에 스트림 읽기 Observable 연결해주기
          - 스트림에 admin 소켓 쓰기 Observable 연결해주기
            - [Send HTTP RES StoreClient] 204
```

### Store Client
```
[Receive HTTP RES Server] 204
- Ready message 수신, 처리
```
Ready message 수신은 StoreClient 가 싱글스레드이고 Ready 요청을 동기식으로 한다는 것과 서버에서 Replay Subject 을 이용하는등 으로 구현하되, socket.io 의 연결복구 와 간섭없도록 하자.

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

## Make Order
![make_order](https://storage.googleapis.com/odoldotol-image-store/simpleorder_make_order.png)

<br><br>

## Ordering
![ordering](https://storage.googleapis.com/odoldotol-image-store/simpleorder_ordering.png)

### Customer Client
```
[Send HTTP REQ Server] Place Order
```

### Server
```
[Receive HTTP REQ CustomerClient] Place Order
- User Auth
  - Order Session 읽기 {store_id}
    - Day Business State === Open 확인
      - Order Session 기반으로 order, order_payment Record 생성
        - [Send HTTP REQ Kakaopay] Payment Ready {order_id, approval_url}
        - Order Session 에 order_id, payment 기록
        - order aggregate 나머지 record 생성
          - [Receive HTTP RES Kakaopay] Payment Ready {tid, redirect_url}
            - Order Record tid 업데이트
            - Order Session 에 tid 기록
            - [Send HTTP RES CustomerClient] Place Order {redirect_url}
```

### Customer Client
```
[Receive HTTP RES Server] Place Order {redirect_url}
유저는 redirect_url 에서 인증/승인 (-> redirect approval_url)
```

### Server
```
[Receive HTTP REQ CustomerClient] Payment Approval {pg_token}
- User Auth
  - Order Session 읽기 {store_id, order_id}
    - Day Business State === Open 확인
      - Order record 읽기 {tid} 및 정상인지 확인
        - [Send HTTP REQ Kakaopay] Payment Approve {tid, order_id, pg_token}
          - [Receive HTTP RES Kakaopay] Payment Approve
            - order_payment 업데이트
            - Order StreamKey StreamId 캐시 확인
              - 없으면 Order Stream 추가
              - Order StreamKey StreamId 캐싱
                - [Send HTTP RES CustomerClient] Payment Approval
```


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

## Customer(KakaoChatbotSkill)
KakaoChatbotSkill 모듈이 FE 역할과 유사

<br><br>

User Store Order 모듈을 BE API 화 가능

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