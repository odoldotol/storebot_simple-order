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
    // 매장스트림 available 확인(재시도시에만?)
    // 카카오페이에 결제승인요청
    // 주문 어그리거트 트랜젝션
    // 스토어 스트림에 주문 푸시
    this.orderPlacementApprovalResponseSrv.complete();
    // 주문성공 알럿 보내기
    // 메시지 성공처리
  }

}
