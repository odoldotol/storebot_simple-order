import { Injectable } from '@nestjs/common';
import {
  OrderPaymentSessionService,
  OrderPlacementSessionService,
  OrderSessionService
} from '@order/session';
import { StoreStateService } from '@store/state';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';
import { OrderMessageApprovalService } from '@order/message';
import { OrderPaymentSession, OrderPlacementSession, OrderSession, UserId } from '@common/type';

@Injectable()
export class OrderPlacementService {

  constructor(
    private readonly storeStateSrv: StoreStateService,
    private readonly orderPlacementSessionSrv: OrderPlacementSessionService,
    private readonly orderSessionSrv: OrderSessionService,
    private readonly orderPaymentSessionSrv: OrderPaymentSessionService,
    private readonly orderPlacementApprovalResponseSrv: OrderPlacementApprovalResponseService,
    private readonly orderMessageApprovalSrv: OrderMessageApprovalService
  ) {}

  public async place(userId: UserId): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderSession = await this.orderSessionSrv.getWithRenewTtl(userId);

    if (orderSession === null) {
      throw new Error(); // Not Found Order Session
    }

    if ((await this.storeStateSrv.isOpen(orderSession.store_id)) === false) {
      throw new Error(); // Store Closed
    }

    if (await this.orderPlacementSessionSrv.isPending()) {
      return this.placeInPending(userId, orderSession);
    }

    return this.placeNew(userId, orderSession);
  }

  private async placeInPending(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderPlacementSession = await this.orderPlacementSessionSrv.get(userId);

    if (orderPlacementSession === null) {
      return this.placeNew(userId, orderSession); // never
    }

    const orderPaymentSession = await this.orderPaymentSessionSrv.get(orderPlacementSession.order_id);

    if (orderPaymentSession === null) {
      return this.placeNew(userId, orderSession);
    }

    if (this.orderSessionSrv.isSame(orderSession, orderPlacementSession, orderPaymentSession) === true) {
      return {
        orderSession,
        orderPlacementSession,
        orderPaymentSession
      };
    }

    await this.orderPaymentSessionSrv.destroy(orderPlacementSession.order_id, orderPaymentSession);

    return this.placeNew(userId, orderSession);
  }

  private async placeNew(
    userId: UserId,
    orderSession: OrderSession
  ): Promise<{
    orderSession: OrderSession;
    orderPlacementSession: OrderPlacementSession;
    orderPaymentSession: OrderPaymentSession;
  }> {
    const orderPlacementSession = await this.orderPlacementSessionSrv.start(userId, orderSession);

    const orderPaymentSession = await this.orderPaymentSessionSrv.start(
      userId,
      orderPlacementSession,
      orderSession
    );

    return {
      orderSession,
      orderPlacementSession,
      orderPaymentSession
    };
  }

  public async approve(
    userId: UserId,
    pgToken: string,
    nickname: string
  ) {
    const result = this.orderPlacementApprovalResponseSrv.response(userId);

    try {
      const orderSession = await this.orderSessionSrv.get(userId);
      const orderPlacementSession = await this.orderPlacementSessionSrv.get(userId);

      if (orderPlacementSession === null) {
        throw new Error(); // Not Found OrderPlacement Session
      }

      const orderPaymentSession = await this.orderPaymentSessionSrv.get(orderPlacementSession.order_id);

      if (orderSession === null) {
        throw new Error(); // Not Found Order Session
      }

      const isStoreOpen = await this.storeStateSrv.isOpen(orderSession.store_id);

      if (orderPaymentSession === null) {
        throw new Error(); // Not Found OrderPayment Session
      }

      if (this.orderSessionSrv.isSame(orderSession, orderPlacementSession, orderPaymentSession) === false) {
        throw new Error(); // Order Session Fault
      }

      if (isStoreOpen === false) {
        this.orderSessionSrv.close(userId).catch(e => this.logger.error(e));
        throw new Error(); // Store Closed
      }

      await this.orderMessageApprovalSrv.push(
        orderSession,
        orderPlacementSession,
        orderPaymentSession,
        pgToken,
        nickname
      );

      this.orderPaymentSessionSrv.close(userId).catch(e => this.logger.error(e));
      this.orderPlacementSessionSrv.close(userId).catch(e => this.logger.error(e));
      this.orderSessionSrv.close(userId).catch(e => this.logger.error(e));
    } catch (error) {
      this.orderPaymentSessionSrv.destroy(userId)
      .then(() => this.orderPlacementSessionSrv.close(userId))
      .catch(e => this.logger.error(e));
      this.orderMessageApprovalFaultSrv.push(userId, error).catch(e => this.orderPlacementApprovalResponseSrv.error(userId, e));
    }

    return result;
  }
}
