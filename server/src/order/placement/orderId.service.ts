import { Injectable } from '@nestjs/common';
import { OrderId } from '@common/type';
import { v7 as uuidV7 } from 'uuid';

@Injectable()
export class OrderIdService {

  // 같은 타임스템프에 한해 중복검사
  private readonly mapA = new Map<number, Set<OrderId>>();
  private readonly mapB = new Map<number, Set<OrderId>>();

  constructor() {
    // 일정시간(1s?)마다 A,B 바꿔가며 비우면 될듯. 대신 A,B 두 곳에서 타임스탬프 검사를 해야하는 오버헤드
    this.mapA;
    this.mapB;
  }

  public generate(): OrderId {
    return uuidV7();
  }
}