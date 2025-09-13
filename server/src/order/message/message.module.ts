import { OrderMessageModule } from '@modules';
import { OrderMessageApprovalService } from './approval.service';
import { OrderMessageApprovalFaultService } from './approvalFault.service';
import { OrderMessagePlacedService } from './placed.service';

OrderMessageModule.providers = [
  OrderMessageApprovalService,
  OrderMessageApprovalFaultService,
  OrderMessagePlacedService,
];

OrderMessageModule.exports = [
  OrderMessageApprovalService,
  OrderMessageApprovalFaultService,
  OrderMessagePlacedService,
];
