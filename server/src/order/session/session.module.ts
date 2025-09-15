import { OrderSessionModule } from '@module';
import * as Provider from './provider';
import * as Export from './export';
import { addExports, addProviders } from '@util';

addProviders(OrderSessionModule, Provider);
addExports(OrderSessionModule, Export);
