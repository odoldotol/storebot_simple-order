import { Injectable } from '@nestjs/common';
import { StoreId } from '@common/type';

@Injectable()
export class StoreStateService {

  public isOpen(storeId: StoreId): Promise<boolean> {
    return Promise.resolve(true);
  }
}
