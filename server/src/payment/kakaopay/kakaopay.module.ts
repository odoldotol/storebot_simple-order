import { PaymentKakaopayModule } from '@module';
import { PaymentKakaopayService } from './kakaopay.service';

PaymentKakaopayModule.providers = [PaymentKakaopayService];

PaymentKakaopayModule.exports = [PaymentKakaopayService];
