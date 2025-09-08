import { Module } from '@nestjs/common';
import { OrderSessionModule } from '@order/session';
import { PaymentSessionModule } from '@payment/session';
import { OrderMessageModule } from '@order/message';
import { OrderPlacementController } from './placement.controller';
import { OrderPlacementService } from './placement.service';
import { OrderIdService } from './orderId.service';
import { OrderPlacementApprovalResponseService } from './approvalResponse.service';

@Module({
  imports: [OrderSessionModule, PaymentSessionModule, OrderMessageModule],
  controllers: [OrderPlacementController],
  providers: [
    OrderIdService,
    OrderPlacementService,
    OrderPlacementApprovalResponseService,
  ],
  exports: [OrderPlacementService],
})
export class OrderPlacementModule {}
