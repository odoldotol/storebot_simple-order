import { Injectable } from '@nestjs/common';
import { Placeable } from '@type';

@Injectable()
export class OrderMessageApprovalService {
  /**
   * @Todo - Imple
   */
  public async push(placeable: Placeable): Promise<string> {
    placeable;

    return '';
  }

  public subscribe() {}
}
