import { OrderPlacementModule } from '@module';
import * as Controller from './controller';
import * as Provider from './provider';
import * as Export from './export';
import { addControllers, addExports, addProviders } from '@util';

addControllers(OrderPlacementModule, Controller);
addProviders(OrderPlacementModule, Provider);
addExports(OrderPlacementModule, Export);
