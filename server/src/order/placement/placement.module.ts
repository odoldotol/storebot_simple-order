import { OrderPlacementModule } from '@module';
import * as Provider from './provider';
import * as Export from './export';
import { addExports, addProviders } from '@util';

addProviders(OrderPlacementModule, Provider);
addExports(OrderPlacementModule, Export);
