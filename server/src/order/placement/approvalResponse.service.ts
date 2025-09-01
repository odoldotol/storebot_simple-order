import { Injectable } from '@nestjs/common';
import * as R from 'rxjs';
import { UserId } from '@common/type';

@Injectable()
export class OrderPlacementApprovalResponseService {

  private readonly map = new Map<UserId, R.Subject<any>>(); // OrderPlacementApprovalResponseMap

  public response(userId: UserId): Promise<any> {
    const subject = new R.Subject<any>();

    if (this.map.has(userId)) {
      this.error(userId, new Error()); // 처리되지 않은 응답 에러처리
    }

    this.map.set(userId, subject);

    return R.lastValueFrom(subject);
  }

  public error(userId: UserId, error: any): void {
    const subject = this.map.get(userId);

    if (subject) {
      subject.error(error);
      this.map.delete(userId);
    }
  }

  public complete(userId: UserId, value: any): void {
    const subject = this.map.get(userId);

    if (subject) {
      subject.next(value);
      subject.complete();
      this.map.delete(userId);
    }
  }
}
