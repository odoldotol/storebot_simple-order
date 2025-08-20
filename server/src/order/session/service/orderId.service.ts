import { Injectable } from '@nestjs/common';
import { OrderId } from '@common/type';
import { v7 as uuidV7 } from 'uuid';

@Injectable()
export class OrderIdService {

  public generate(): OrderId {
    return uuidV7();
  }
}