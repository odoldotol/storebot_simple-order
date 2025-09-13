import { OrderSessionModule } from '@modules';
import { OrderSessionRepository } from './session.repository';
import { OrderSessionService } from './session.service';
import { OrderSessionIdService } from './sessionId.service';

OrderSessionModule.providers = [
  OrderSessionRepository,
  OrderSessionService,
  OrderSessionIdService,
];

OrderSessionModule.exports = [OrderSessionService];
