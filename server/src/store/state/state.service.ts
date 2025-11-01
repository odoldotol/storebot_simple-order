import { Injectable } from '@nestjs/common';
import { StoreStateRepository } from './state.repository';
import { StoreId, StoreState, StoreStateCode } from '@type';

@Injectable()
export class StoreStateService {
  constructor(private readonly repo: StoreStateRepository) {}

  public get(storeId: StoreId): Promise<StoreState> {
    this.repo.read(storeId);
    // 없으면 Store, Business 에서 읽어야함
    // Store 에도 없으면 에러
    throw new Error();
  }

  public isOrderable(storeState: StoreState): boolean {
    return storeState.state_code === StoreStateCode.OPEN;
  }

  public isBusinessActive(storeState: StoreState): boolean {
    return storeState.state_code >= StoreStateCode.OPEN;
  }
}

// ------------------------------------------------------------------------------------

// type StoreStateMetadata = {
//   orderable: boolean;
//   business_active: boolean;
//   label_ko: string;
//   label_en: string;
// };

// const STORE_STATE_METADATA: Record<StoreStateCode, StoreStateMetadata> = {
//   [StoreStateCode.PREPARING]: {
//     orderable: false,
//     business_active: true,
//     label_ko: '준비 중',
//     label_en: 'Preparing',
//   },
//   [StoreStateCode.OPEN]: {
//     orderable: true,
//     business_active: true,
//     label_ko: '영업 중',
//     label_en: 'Open',
//   },
//   [StoreStateCode.BREAK]: {
//     orderable: false,
//     business_active: true,
//     label_ko: '브레이크 타임',
//     label_en: 'Break',
//   },
//   [StoreStateCode.CLOSING]: {
//     orderable: false,
//     business_active: false,
//     label_ko: '마감 중',
//     label_en: 'Closing',
//   },
//   [StoreStateCode.CLOSED]: {
//     orderable: false,
//     business_active: false,
//     label_ko: '영업 종료',
//     label_en: 'Closed',
//   },
// };
