import { StoreId, StoreState } from '@type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreStateRepository {
  public async read(storeId: StoreId): Promise<StoreState | null> {
    storeId;
    return null;
  }
}
