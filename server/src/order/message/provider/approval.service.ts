import { Injectable } from '@nestjs/common';
import { Placeable } from '@type';

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
