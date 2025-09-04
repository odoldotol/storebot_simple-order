import { Placeable } from '@common/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMessageApprovalService {

  public async push(
    placeable: Placeable,
    pgToken: string,
    nickname: string
  ): Promise<string> {}

  public subscribe() {}
}
