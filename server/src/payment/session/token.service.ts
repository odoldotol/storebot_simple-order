import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  PaymentToken,
  UserId,
  WithUserId,
} from '@common/type';

@Injectable()
export class PaymentTokenService {

  private readonly bytes = 12;
  private readonly retryLimit = 100;

  constructor(
    private readonly repo: PaymentTokenRepository
  ) {}

  /**
   * OpaqueToken, base64url
   * 12 바이트면 길이 16  
   * 대충 1억건 유지한다고 할때 12바이트면 충돌확율 6.31*10^-14
   */
  public async generate(withUserId: WithUserId): Promise<PaymentToken> {
    let retry = 0;

    do {
      try {
        const token = this.generateOpaqueToken(this.bytes).toString('base64url') as PaymentToken;
        return await this.repo.create(token, withUserId.user_id); // 토큰 중복시 키애러 던져짐
      } catch (error) {
        if (++retry < this.retryLimit) {
          // suppose never
          throw new Error(error); // PaymentTokenFaultException
        }
      }
    } while (true);
  }

  public destroy(token: PaymentToken): Promise<void> {
    return this.repo.delete(token);
  }

  public getUserId(token: PaymentToken): Promise<UserId | null> {
    return this.repo.read(token);
  }

  private generateOpaqueToken(bytes: number): Buffer {
    return crypto.randomBytes(bytes);
  }
}