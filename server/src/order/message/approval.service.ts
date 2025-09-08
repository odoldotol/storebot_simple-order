import { Placeable } from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMessageApprovalService {
  /**
   * @Todo - Imple
   */
  public async push(
    placeable: Placeable,
    pgToken: string,
    nickname: string,
  ): Promise<string> {
    placeable;
    pgToken;
    nickname;

    return '';
  }

  public subscribe() {}
}
