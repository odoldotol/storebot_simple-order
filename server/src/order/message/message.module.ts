import { OrderMessageModule } from '@module';
import * as Provider from './provider';
import * as Export from './export';
import { addExports, addProviders } from '@util';

addProviders(OrderMessageModule, Provider);
addExports(OrderMessageModule, Export);
