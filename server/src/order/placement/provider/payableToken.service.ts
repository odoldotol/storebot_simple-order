import crypto from 'node:crypto';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { OrderId, PayableToken, UserId } from '@type';

/**
 * UserId 와 OrderId 를 문자열 그대로 Redis 에 String 으로 저장하는데 메모리를 절약할 여지가 있음.
 * uuid 기준 buffer 는 16바이트? 문자열은 36바이트?
 * 하지만 동시 결제세션 유지중인것이 100만개라고 해도 36MB 뿐이긴함.
 */
@Injectable()
export class PayableTokenService {
  private readonly bytes = 12;
  private readonly retryLimit = 100;

  private readonly userIdLength = 36; // uuidv7 길이

  constructor(
    @Inject('PayableTokenRepository')
    private readonly repo: typeof PayableTokenRepository,
  ) {}

  /**
   * OpaqueToken, base64url
   * 12 바이트면 길이 16
   * 대충 1억건 유지한다고 할때 12바이트면 충돌확율 6.31*10^-14
   */
  public async generate(
    userId: UserId,
    orderId: OrderId,
  ): Promise<PayableToken> {
    let retry = 0;
    let token: PayableToken;

    do {
      try {
        token = this.generateOpaqueToken(this.bytes).toString(
          'base64url',
        ) as PayableToken;
        await this.repo.create(token, userId, orderId); // 토큰 중복시 키애러 던져짐
        return token;
      } catch (error: any) {
        if (error !== /* @Todo */ 'Duplicate key error') {
          throw new PayableTokenFaultException(error);
        }
      }
    } while (++retry < this.retryLimit);

    // suppose never
    throw new PayableTokenFaultException('Exceed retry limit');
  }

  public destroy(token: PayableToken): Promise<void> {
    return this.repo.delete(token);
  }

  public async getIds(
    token: PayableToken,
  ): Promise<{ userId: UserId; orderId: OrderId }> {
    const value = await this.repo.read(token);

    if (value === null) {
      throw new PayableTokenFaultException();
    }

    return {
      userId: value.slice(0, this.userIdLength),
      orderId: value.slice(this.userIdLength + 1),
    };
  }

  private generateOpaqueToken(bytes: number): Buffer {
    return crypto.randomBytes(bytes);
  }
}

/**
 * @Todo - Imple
 */
class PayableTokenFaultException extends Error {}

const PayableTokenRepository = {
  async read(token: PayableToken): Promise<string | null> {
    token;
    return null;
  },

  async create(
    token: PayableToken,
    userId: UserId,
    orderId: OrderId,
  ): Promise<void> {
    token;
    userId;
    orderId;
  },

  async delete(token: PayableToken): Promise<void> {
    token;
  },
};

export const PayableTokenRepositoryProvider: Provider = {
  provide: 'PayableTokenRepository',
  useValue: PayableTokenRepository,
};
