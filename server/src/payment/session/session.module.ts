import { Module } from '@nestjs/common';
import { PaymentKakaopayModule } from '@payment/kakaopay';
import {
  PaymentSessionRepository,
  PaymentSessionService,
} from './session.service';
import {
  PaymentSessionTokenRepository,
  PaymentSessionTokenService,
} from './token.service';

@Module({
  imports: [PaymentKakaopayModule],
  providers: [
    {
      provide: 'PaymentSessionRepository',
      useValue: PaymentSessionRepository,
    },
    {
      provide: 'PaymentSessionTokenRepository',
      useValue: PaymentSessionTokenRepository,
    },
    PaymentSessionService,
    PaymentSessionTokenService,
  ],
  exports: [PaymentSessionService],
})
export class PaymentSessionModule {}
