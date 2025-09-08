import { Module } from '@nestjs/common';
import { PaymentKakaopayService } from './kakaopay.service';

@Module({
  providers: [PaymentKakaopayService],
  exports: [PaymentKakaopayService],
})
export class PaymentKakaopayModule {}
