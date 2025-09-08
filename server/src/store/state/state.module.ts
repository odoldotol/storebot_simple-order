import { Module } from '@nestjs/common';
import { StoreStateRepository } from './state.repository';
import { StoreStateService } from './state.service';

@Module({
  imports: [
    // redis
  ],
  providers: [StoreStateRepository, StoreStateService],
  exports: [StoreStateService],
})
export class StoreStateModule {}
