import { PaymentSessionModule } from '@module';
import * as Provider from './provider';
import * as Export from './export';
import { addExports, addProviders } from '@util';

addProviders(PaymentSessionModule, Provider);
addExports(PaymentSessionModule, Export);
