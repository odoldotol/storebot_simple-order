import { Module } from '@nestjs/common';
import { OrderMessageApprovalService } from './approval.service';
import { OrderMessageApprovalFaultService } from './approvalFault.service';
import { OrderMessagePlacedService } from './placed.service';

@Module({
  providers: [
    OrderMessageApprovalService,
    OrderMessageApprovalFaultService,
    OrderMessagePlacedService,
  ],
  exports: [
    OrderMessageApprovalService,
    OrderMessageApprovalFaultService,
    OrderMessagePlacedService,
  ],
})
export class OrderMessageModule {}
