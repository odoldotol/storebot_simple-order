import { Module } from '@nestjs/common';
import {
  OrderSessionService,
  OrderSessionIdService,
  OrderPaymentSessionService,
  OrderPlacementSessionService,
} from './service';

@Module({
  imports: [
    // redis
  ],
  providers: [
    OrderSessionService,
    OrderSessionIdService,
    OrderPaymentSessionService,
    OrderPlacementSessionService,
  ],
  exports: [
    OrderSessionService,
    OrderPaymentSessionService,
    OrderPlacementSessionService,
  ],
})
export class OrderSessionModule {}
