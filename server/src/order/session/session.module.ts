import { Module } from '@nestjs/common';
import { StoreStateModule } from '@store/state';
import { OrderSessionRepository } from './session.repository';
import { OrderSessionService } from './session.service';
import { OrderSessionIdService } from './sessionId.service';

@Module({
  imports: [
    // redis
    StoreStateModule,
  ],
  providers: [
    OrderSessionRepository,
    OrderSessionService,
    OrderSessionIdService,
  ],
  exports: [OrderSessionService],
})
export class OrderSessionModule {}
