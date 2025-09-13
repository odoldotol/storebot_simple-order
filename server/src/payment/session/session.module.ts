import { PaymentSessionModule } from '@modules';
import {
  PaymentSessionRepository,
  PaymentSessionService,
} from './session.service';
import {
  PaymentSessionTokenRepository,
  PaymentSessionTokenService,
} from './token.service';

PaymentSessionModule.providers = [
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
];

PaymentSessionModule.exports = [PaymentSessionService];
