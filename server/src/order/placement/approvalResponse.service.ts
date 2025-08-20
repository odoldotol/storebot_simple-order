import { Injectable } from '@nestjs/common';
import * as R from 'rxjs';
import { OrderId } from '@common/type';

@Injectable()
export class OrderPlacementApprovalResponseService {

  private readonly orderMap = new Map<OrderId, R.Subject<any>>();

  public response(orderId: OrderId): Promise<any> {
    const subject = new R.Subject<any>();

    this.orderMap.set(orderId, subject);

    return R.lastValueFrom(subject);
  }

  public error(orderId: OrderId, error: any): void {
    const subject = this.orderMap.get(orderId);

    if (subject) {
      subject.error(error);
      this.orderMap.delete(orderId);
    }
  }

  public complete(orderId: OrderId, value: any): void {
    const subject = this.orderMap.get(orderId);

    if (subject) {
      subject.next(value);
      subject.complete();
      this.orderMap.delete(orderId);
    }
  }
}
