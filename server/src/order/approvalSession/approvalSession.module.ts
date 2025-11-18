import { OrderApprovalSessionModule } from '@module';
import * as Provider from './provider';
import * as Export from './export';
import { addExports, addProviders } from '@util';

addProviders(OrderApprovalSessionModule, Provider);
addExports(OrderApprovalSessionModule, Export);
