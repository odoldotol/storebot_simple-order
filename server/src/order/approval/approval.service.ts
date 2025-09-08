import {
  OrderMessageApprovalFaultService,
  OrderMessageApprovalService,
  OrderMessagePlacedService,
} from '@order/message';
import { PaymentKakaopayService } from '@payment/kakaopay';

export class OrderApprovalService {
  private readonly sub;

  constructor(
    private readonly orderMessageApprovalSrv: OrderMessageApprovalService,
    private readonly orderMessageApprovalFaultSrv: OrderMessageApprovalFaultService,
    private readonly orderMessagePlacedSrv: OrderMessagePlacedService,
    private readonly paymentKakaopaySrv: PaymentKakaopayService,
  ) {
    this.sub = this.orderMessageApprovalSrv.subscribe(); // ?
    this.sub; //
    this.approve;
  }

  /**
   * @Todo - Imple
   */
  private approve(id: string, message: any) {
    /*
메세지로 kakaopay 결제 승인요청하기 (이미 승인된 경우 성공간주, 승인실패/에러시 *주문실패처리)
- Order 어그리거트 생성하기 <PostgresTX> (이미 생성되어있을경우 성공간주, 에러시 주문실패처리)
  - *메시지푸시 (에러시 주문실패처리) (메시지가 추가되고 실패처리로 빠지는 일은 없어야함)


### 주문실패처리
kakaopay 결제중이던 완료던 취소 (에러시 THROW)
- Order 어그리거트 없으면 패스, 있으면 결제 취소정보 업데이트 <PostgresTX> (에러시 THROW)
  - *OrderApprovalFault 메시지 푸시 (에러시 THROW)
    - 메시지 ACK

### 메시지푸시
Store 스트림 캐시에 주문서id 중복유무 확인하고 중복이면 스트림에 메시지 있는지 확인
- 없으면 스트림에 푸시하고 주문서id-스트림key/id 캐싱하기 (*레디스함수로 원자적처리) (메시지 추가 에러시 THROW) (캐싱만 실패하는 경우 있을 수 있는데, 그래도 성공간주. Approval 메시지 재처리되어서 스트림 중복 추가되어도 괜찮아야함 => store client 애서 메시지 받을때 중복은 처리 않해야함) (Ready 메시지 같은거 추가할때 캐시 없음 발견되면 후보정하기)
  - *OrderPlaced 메시지 푸시 (이 메시지의 처리는 멱등성 보장되어야함) (에러시 로깅, 메시지 ACK 하지 않음)
    - 메시지 ACK
    */

    id;
    message;

    this.paymentKakaopaySrv;
    this.orderMessagePlacedSrv;
    this.orderMessageApprovalFaultSrv;
  }
}
