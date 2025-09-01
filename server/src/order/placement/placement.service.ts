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
  OrderPlacementSession,
  PaymentSession,
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

  public async place(userId: UserId): Promise<{
    orderable: Orderable;
    placeable: OrderPlacementSession;
    payable: PaymentSession;
  }> {
    const orderable = await this.orderSessionSrv.getOrderable(userId, true);

    if (await this.orderPlacementSessionSrv.isPending()) {
      try {
        return this.placeInPending(userId, orderable);
      } catch (e) {
        this.logger.warn(e);
      }
    }

    return this.placeNew(userId, orderable);
  }

  private async placeInPending(
    userId: UserId,
    orderable: Orderable
  ): Promise<{
    orderable: Orderable;
    placeable: OrderPlacementSession;
    payable: PaymentSession;
  }> {
    const placeable = await this.orderPlacementSessionSrv.getPlaceable(userId);

    const payable = await this.paymentSessionSrv.getPayable(placeable.order_id);

    if (this.orderSessionSrv.areCoherent(orderable, placeable, payable) === true) {
      return {
        orderable,
        placeable,
        payable
      };
    }

    await this.paymentSessionSrv.destroy(placeable.order_id, payable);

    return this.placeNew(userId, orderable);
  }

  private async placeNew(
    userId: UserId,
    orderable: Orderable
  ): Promise<{
    orderable: Orderable;
    placeable: OrderPlacementSession;
    payable: PaymentSession;
  }> {
    const placeable = await this.orderPlacementSessionSrv.start(userId, orderable);

    const payable = await this.paymentSessionSrv.start(
      userId,
      placeable,
      orderable
    );

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
    const result = this.orderPlacementApprovalResponseSrv.response(userId);

    try {
      const orderable = await this.orderSessionSrv.getOrderable(userId);
      const placeable = await this.orderPlacementSessionSrv.getPlaceable(userId);
      const payable = await this.paymentSessionSrv.getPayable(placeable.order_id);

      if (this.orderSessionSrv.areCoherent(orderable, placeable, payable) === false) {
        throw new Error(); // Order Session Fault
      }

      await this.orderMessageApprovalSrv.push(
        orderable,
        placeable,
        payable,
        pgToken,
        nickname
      );

      this.paymentSessionSrv.close(placeable.order_id).catch(e => this.logger.warn(e));
      this.orderPlacementSessionSrv.close(userId).catch(e => this.logger.warn(e));
      this.orderSessionSrv.close(userId).catch(e => this.logger.warn(e));
    } catch (error) {
      this.paymentSessionSrv.destroy(userId)
      .then(() => this.orderPlacementSessionSrv.close(userId))
      .catch(e => this.logger.error(e)); //
      
      this.orderMessageApprovalFaultSrv.push(userId, error)
      .catch(e => this.orderPlacementApprovalResponseSrv.error(userId, e));
    }

    return result;
  }
}
