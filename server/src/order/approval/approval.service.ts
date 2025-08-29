import { OrderPlacementApprovalResponseService } from "@order/placement";
import { OrderStreamApprovalService } from "@order/stream";
import { KakaopayPaymentService } from "@payment";

export class OrderApprovalService {

  private readonly sub

  constructor(
    private readonly orderStreamApprovalSrv: OrderStreamApprovalService,
    private readonly kakaopayPaymentSrv: KakaopayPaymentService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService
  ) {
    this.sub = this.orderStreamApprovalSrv.subscribe(); //
  }

  public approve() {
/*
메세지로 kakaopay 결제 승인요청하기 (이미 승인된 경우 성공간주, 승인실패/에러시 *주문실패처리)
- Order 어그리거트 생성하기 <PostgresTX> (이미 생성되어있을경우 성공간주, 에러시 주문실패처리)
  - *메시지푸시 (에러시 주문실패처리) (메시지가 추가되고 실패처리로 빠지는 일은 없어야함)
    - 메시지 ACK
*/
  }

}
