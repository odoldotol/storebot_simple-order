import { Injectable } from '@nestjs/common';
import { Loggable } from '@logger';
import { OrderSessionService } from '@orderSession';
import { PaymentSessionService } from '@paymentSession';
import { OrderIdService } from './orderId.service';
import {
  OrderMessageApprovalFaultService,
  OrderMessageApprovalService,
} from '@orderMessage';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import { Orderable, OrderId, Payable, PaymentSession, UserId } from '@type';
import {
  IncompleteOrderSessionException,
  NotFoundOrderSessionException,
  NotOpenStoreException,
  OrderableSessionIdFaultException,
} from '@exception';

@Injectable()
export class OrderPlacementService extends Loggable {
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

  public async place(userId: UserId): Promise<Payable> {
    if (await this.paymentSessionSrv.isPending(userId)) {
      return this.placeInPending(userId);
    }

    return this.placeNew(userId);
  }

  private async placeInPending(userId: UserId): Promise<Payable> {
    let paymentSession: PaymentSession | undefined = undefined;

    try {
      paymentSession = await this.paymentSessionSrv.getSession(userId);
      return await this.orderSessionSrv.getPayable(userId, paymentSession, {
        checkIdLast: true,
      });
    } catch (error) {
      await this.paymentSessionSrv
        .destroy(userId, paymentSession)
        .catch(e => this.logger.error(e)); //

      if (
        error instanceof NotFoundOrderSessionException ||
        error instanceof IncompleteOrderSessionException ||
        error instanceof NotOpenStoreException
      ) {
        throw error;
      }

      if (error instanceof OrderableSessionIdFaultException) {
        return this.createPayable(userId, error.orderable);
      }

      if (paymentSession) {
        this.logger.error(error); // orderable 에서 예상치 못한 에러 발생!?
        // throw error;
      } else {
        this.logger.error(error); // payable 에서 예상치 못한 에러 발생!?
      }

      return this.placeNew(userId);
    }
  }

  private async placeNew(userId: UserId): Promise<Payable> {
    const orderable = await this.orderSessionSrv.getOrderable(userId);

    return this.createPayable(userId, orderable);
  }

  private createPayable(userId: UserId, orderable: Orderable): Promise<Payable> {
    return this.paymentSessionSrv.start(userId, this.orderIdSrv.generate(), orderable);
  }

  public async approve(
    userId: UserId,
    orderId: OrderId,
    pgToken: string,
  ): Promise<void> {
    // userId 로 nickname 가져오기
    const nickname = '';

    // PaymentSession 찾아서 order_id 다르면 PaymentSessionFaultException 던지기
    const paymentSession = await this.paymentSessionSrv.getSession(userId);
    if (paymentSession.order_id !== orderId) {
      throw new Error(); // PaymentSessionFaultException
    }

    try {
      const payable = await this.orderSessionSrv.getPayable(userId, paymentSession, {
        checkComplete: false,
      });

      await this.orderMessageApprovalSrv.push({
        user_id: userId,
        nickname,
        pg_token: pgToken,
        ...payable
      });
    } catch (error) {
      await Promise.allSettled([
        this.paymentSessionSrv.destroy(userId, paymentSession), //
        this.orderMessageApprovalFaultSrv
          .push(userId, error)
          .catch(e =>
            this.orderPlacementApprovalResponseSrv.error(userId, e),
          ),
      ]);

      return;
    }

    await Promise.all([
      this.paymentSessionSrv.close(userId),
      this.orderSessionSrv.close(userId),
    ]);
  }
}
