import { PaymentCallbackGatewayModule } from '@module';
import * as Controller from './controller';
import * as Provider from './provider';
import { addControllers, addProviders } from '@util';

addControllers(PaymentCallbackGatewayModule, Controller);
addProviders(PaymentCallbackGatewayModule, Provider);
