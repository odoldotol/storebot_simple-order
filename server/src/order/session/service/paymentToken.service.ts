import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Url, UserId } from '@common/type';

@Injectable()
export class OrderPaymentTokenService {

  constructor(
    private readonly orderPaymentTokenRepo: OrderPaymentTokenRepository
  ) {}

  /**
   * OpaqueToken, base64url
   * 12 바이트면 길이 16  
   * 대충 1억건 유지한다고 할때 12바이트면 충돌확율 6.31*10^-14
   */
  public async generate(
    userId: UserId,
    bytes = 12
  ): Promise<Url> {
    let retry = 0;

    do {
      const token = this.generateOpaqueToken(bytes);

      if (this.orderPaymentTokenRepo.has(token)) {
        retry++;
        continue;
      }

      await this.orderPaymentTokenRepo.set(token, userId);
      return token;
    } while (retry < 100 /* retryLimit */);

    throw new Error(); // 중복으로 실패 // never
  }

  public destroy(token: Url): Promise<void> {
    return this.orderPaymentTokenRepo.delete(token);
  }

  private generateOpaqueToken(bytes: number): Url {
    return crypto.randomBytes(bytes).toString('base64url') as Url;
  }
}