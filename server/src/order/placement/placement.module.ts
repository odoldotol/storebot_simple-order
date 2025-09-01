import { Module } from '@nestjs/common';
import { OrderPlacementController } from './placement.controller';
import { OrderPlacementService } from './placement.service';

@Module({
  controllers: [OrderPlacementController],
  providers: [OrderPlacementService],
  exports: [OrderPlacementService],
})
export class OrderPlacementModule {}
