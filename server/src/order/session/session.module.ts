import { Module } from '@nestjs/common';
import { OrderSessionService } from './session.service';
import { OrderSessionIdService } from './sessionId.service';

@Module({
  imports: [
    // redis
  ],
  providers: [OrderSessionService, OrderSessionIdService],
  exports: [OrderSessionService],
})
export class OrderSessionModule {}
