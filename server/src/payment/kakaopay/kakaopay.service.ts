import { Injectable } from '@nestjs/common';
import {
  OrderSession,
  PayableToken,
  // OrderId,
  // OrderSession,
  Redirect,
  // UserId
} from '@type';

@Injectable()
export class PaymentKakaopayService {
  /**
   * @Todo - Impl
   */
  public async ready(
    orderSession: OrderSession,
    payableToken: PayableToken,
  ): Promise<{
    tid: string;
    redirect: Redirect;
  }> {
    orderSession;
    payableToken;

    return {
      tid: '',
      redirect: {
        next_redirect_app_url: 'https://kakao.com/redirect',
        next_redirect_mobile_url: 'https://kakao.com/redirect',
        next_redirect_pc_url: 'https://kakao.com/redirect',
        android_app_scheme: 'kakao${APP_KEY}://kakaopay',
        ios_app_scheme: 'kakao${APP_KEY}://kakaopay',
      },
    };
  }

  public async approve() {}

  public async order() {}

  /**
   * @Todo - impl
   */
  public async cancel(tid: string) {
    tid;
  }
}
