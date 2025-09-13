import { PaymentKakaopayModule } from '@modules';
import { PaymentKakaopayService } from './kakaopay.service';

PaymentKakaopayModule.providers = [PaymentKakaopayService];

PaymentKakaopayModule.exports = [PaymentKakaopayService];
