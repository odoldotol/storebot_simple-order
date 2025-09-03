import { Injectable } from '@nestjs/common';
import { Loggable } from '@Logger';
import { OrderSessionService } from '@order/session';
import { OrderPlacementSessionService } from './session';
import { PaymentSessionService } from '@payment/session';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import {
  OrderMessageApprovalFaultService,
  OrderMessageApprovalService
} from '@order/message';
import {
  Orderable,
  OrderAbles,
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
    private readonly orderPlacementSessionSrv: OrderPlacementSessionService,
    private readonly paymentSessionSrv: PaymentSessionService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
    private readonly orderMessageApprovalSrv: OrderMessageApprovalService,
    private readonly orderMessageApprovalFaultSrv: OrderMessageApprovalFaultService
  ) {
    super();
  }

  public async place(userId: UserId): Promise<OrderAbles> {
    if (await this.orderPlacementSessionSrv.isPending()) {
      const placeable = await this.orderPlacementSessionSrv.getPlaceable(userId);

      try {
        return this.placeInPending(placeable);
      } catch (e) {
        this.logger.warn(e);
      }
    }

    return this.placeNew(userId);
  }

  private async placeInPending(placeable: Placeable): Promise<OrderAbles> {
    try {
      const [orderable, payable] = await Promise.all([
        this.orderSessionSrv.getOrderable(placeable, true), // @todo - 꼭 placeable 로 찾아야만 하는데 코드에서 강제되지 않는 구현 나뿜, 개선해.
        this.paymentSessionSrv.getPayable(placeable)
      ]);

      return {
        orderable,
        placeable,
        payable
      };
    } catch (error) {
      await this.paymentSessionSrv.destroy(placeable).catch(e => this.logger.error(e));
      throw error;
    }
  }

  private async placeNew(userId: UserId): Promise<OrderAbles> {
    const orderable = await this.orderSessionSrv.getOrderable(userId, true);
    const placeable = await this.orderPlacementSessionSrv.start(orderable);
    const payable = await this.paymentSessionSrv.start(placeable, orderable);

    return {
      orderable,
      placeable,
      payable
    };
  }

  public async approve(
    userId: UserId,
    pgToken: string,
    nickname: string
  ) {
    const placeable = await this.orderPlacementSessionSrv.getPlaceable(userId);

    let
    payable: Payable | undefined = undefined,
    orderable: Orderable;

    try {
      const [orderableResult, payableResult] = await Promise.allSettled([
        this.orderSessionSrv.getOrderable(placeable),
        this.paymentSessionSrv.getPayable(placeable)
      ]);

      if (payableResult.status === 'rejected') {
        throw payableResult.reason;
      }

      if (orderableResult.status === 'rejected') { // orderable 이 실패해도 성공한 payable 할당하고 에러던지기
        if (payableResult.status === 'fulfilled') {
          payable = payableResult.value;
        }
        throw orderableResult.reason;
      }

      orderable = orderableResult.value;
      payable = payableResult.value;

      await this.orderMessageApprovalSrv.push(
        orderable,
        placeable,
        payable,
        pgToken,
        nickname
      );
    } catch (error) {
      await this.paymentSessionSrv.destroy(payable ?? placeable)
      .then(() => this.orderPlacementSessionSrv.close(placeable));
      throw error;
    }

    this.paymentSessionSrv.close(payable);
    this.orderPlacementSessionSrv.close(placeable);
    this.orderSessionSrv.close(orderable);
  }
}
