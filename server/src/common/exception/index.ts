import { BadRequestException } from '@nestjs/common';
import { Orderable, OrderSession, StoreState } from '@type';

export class OrderSessionIdFaultException extends BadRequestException {
  constructor(public readonly orderSession: OrderSession) {
    super(''); //
  }
}

export class OrderableSessionIdFaultException extends BadRequestException {
  constructor(public readonly orderable: Orderable) {
    super(''); //
  }
}

export class NotFoundOrderSessionException extends BadRequestException {
  constructor() {
    super();
  }
}

export class NotOpenStoreException extends BadRequestException {
  constructor(public readonly storeState: StoreState) {
    super();
  }
}

export class IncompleteOrderSessionException extends BadRequestException {
  constructor(public readonly incomplete: any) {
    super();
  }
}
