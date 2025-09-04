import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { IncompleteOrderSessionException, NotFoundOrderSessionException, NotOpenStoreException, OrderableSessionIdFaultException, OrderSessionService } from '@order/session';
import { PaymentSessionService } from '@payment/session';
import { OrderIdService } from './orderId.service';
import {
  OrderMessageApprovalFaultService,
  OrderMessageApprovalService
} from '@order/message';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import {
  Orderable,
  Payable,
  Placeable,
  UserId
} from '@common/type';

@Injectable()
export class OrderPlacementService
  extends Loggable
{
  constructor(
    private readonly orderSessionSrv: OrderSessionService,
    private readonly paymentSessionSrv: PaymentSessionService,
    private readonly orderIdSrv: OrderIdService,
    private readonly orderMessageApprovalSrv: OrderMessageApprovalService,
    private readonly orderMessageApprovalFaultSrv: OrderMessageApprovalFaultService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
    
    
  ) {
    super();
  }

  public async place(userId: UserId): Promise<Placeable> {
    if (await this.paymentSessionSrv.isPending(userId)) {
      return this.placeInPending(userId);
    }

    return this.placeNew(userId);
  }

  private async placeInPending(userId: UserId): Promise<Placeable> {
    let payable: Payable | undefined = undefined;

    try {
      payable = await this.paymentSessionSrv.getPayable(userId);
      return await this.orderSessionSrv.getPlaceable(payable, { checkIdLast: true });
    } catch (error) {
      await this.paymentSessionSrv.destroy(payable ?? userId).catch(e => this.logger.error(e)); //

      if (error instanceof NotFoundOrderSessionException || error instanceof IncompleteOrderSessionException || error instanceof NotOpenStoreException) {
        throw error;
      }

      if (error instanceof OrderableSessionIdFaultException) {
        return this.placeNew(error.orderable);
      }

      if (payable) {
        this.logger.error(error); // orderable 에서 예상치 못한 에러 발생!?
        // throw error;
      } else {
        this.logger.error(error); // payable 에서 예상치 못한 에러 발생!?
      }

      return this.placeNew(userId);
    }
  }

  private async placeNew(userId: UserId): Promise<Placeable>;
  private async placeNew(orderable: Orderable): Promise<Placeable>;
  private async placeNew(arg: UserId | Orderable): Promise<Placeable> {
    let orderable: Orderable;

    if (typeof arg === 'string') {
      orderable = await this.orderSessionSrv.getOrderable(arg);
    } else {
      orderable = arg;
    }

    return this.paymentSessionSrv.start(this.orderIdSrv.generate(), orderable);
  }

  public async approve(
    payable: Payable,
    pgToken: string,
    nickname: string
  ): Promise<void> {
    let placeable: Placeable | undefined = undefined;

    try {
      placeable = await this.orderSessionSrv.getPlaceable(payable, { checkComplete: false });

      await this.orderMessageApprovalSrv.push(
        placeable,
        pgToken,
        nickname
      );
    } catch (error) {
      await Promise.allSettled([
        this.paymentSessionSrv.destroy(payable), //
        this.orderMessageApprovalFaultSrv.push(payable.user_id, error)
        .catch(e => this.orderPlacementApprovalResponseSrv.error(payable.user_id, e))
      ]);

      return;
    }

    await Promise.all([
      this.paymentSessionSrv.close(placeable),
      this.orderSessionSrv.close(placeable)
    ]);
  }
}
