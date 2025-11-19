import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrderPlacementService } from '@orderPlacement';
import { API_SPEC } from '@apiSpec/paymentCallbackGateway.apiSpec';
import { OrderId, UserId } from '@type';

@Controller(API_SPEC.prefix)
export class PaymentCallbackGatewayController {
  constructor(private readonly orderPlacementSrv: OrderPlacementService) {}

  // @UseGuards - payableToken 추출, PayableToken 으로 userId, orderId 추출 (PayableTokenService) GETDEL
  // @UseInterceptors(TimeoutInterceptor)
  // @UseFilters - approve 내부 예외, 메시지 push 에러, approvalSession start 에러 등등
  @HttpCode(HttpStatus.ACCEPTED) // 주문승인메시지를 푸시했으며 비동기적으로 처리결과를 알려줄것.
  @Post(API_SPEC.approveByKakaopay.path)
  public async approveByKakaopay(
    // @Todo - pipe
    pgToken = '',
    userId = '' as UserId,
    orderId = '' as OrderId,
  ) {
    await this.orderPlacementSrv.approve(pgToken, userId, orderId);
    return '성공응답'; // @Todo - 리서치: 챗봇 스킬응답이 가능한지? 단지 앱전환만 가능한지? 무엇이 가능한지?
  }

  @Post(API_SPEC.cancelByKakaopay.path)
  public cancelByKakaopay() {}

  @Post(API_SPEC.failByKakaopay.path)
  public failByKakaopay() {}
}
