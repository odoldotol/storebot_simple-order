import { Injectable } from '@nestjs/common';
import * as R from 'rxjs';
import { UserId } from '@common/type';

@Injectable()
export class OrderPlacementApprovalResponseService {

  private readonly orderMap = new Map<UserId, R.Subject<any>>();

  public response(userId: UserId): Promise<any> {
    const subject = new R.Subject<any>();

    if (this.orderMap.has(userId)) {
      this.error(userId, new Error()); // 처리되지 않은 응답 에러처리
    }

    this.orderMap.set(userId, subject);

    return R.lastValueFrom(subject);
  }

  public error(userId: UserId, error: any): void {
    const subject = this.orderMap.get(userId);

    if (subject) {
      subject.error(error);
      this.orderMap.delete(userId);
    }
  }

  public complete(userId: UserId, value: any): void {
    const subject = this.orderMap.get(userId);

    if (subject) {
      subject.next(value);
      subject.complete();
      this.orderMap.delete(userId);
    }
  }
}
