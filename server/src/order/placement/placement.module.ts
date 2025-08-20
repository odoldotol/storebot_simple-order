import { Module } from '@nestjs/common';
import { OrderPlacementService } from './placement.service';

@Module({
  providers: [OrderPlacementService],
  exports: [OrderPlacementService],
})
export class OrderPlacementModule {}
