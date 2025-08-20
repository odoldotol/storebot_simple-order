import { OrderId, OrderSession, Redirect, Url, UserId } from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaopayPaymentService {

  public async ready(
    orderId: OrderId,
    userId: UserId,
    orderSession: OrderSession,
    orderPaymentToken: Url
  ): Promise<{
    tid: string;
    redirect: Redirect;
  }> {
    return {
      tid: "",
      redirect: {
        next_redirect_app_url: "https://kakao.com/redirect",
        next_redirect_mobile_url: "https://kakao.com/redirect",
        next_redirect_pc_url: "https://kakao.com/redirect",
        android_app_scheme: "kakao${APP_KEY}://kakaopay",
        ios_app_scheme: "kakao${APP_KEY}://kakaopay",
      }
    };
  }

  public async approve() {}

  public async order() {}

  public async cancel() {}
}