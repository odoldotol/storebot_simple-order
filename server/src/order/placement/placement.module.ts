import { OrderPlacementModule } from '@modules';
import { controllers } from './controller';
import { OrderPlacementService, providers } from './provider';

OrderPlacementModule.controllers = controllers;
OrderPlacementModule.providers = providers;

/////////////////////////////////////////////////////////////////////

OrderPlacementModule.exports = [OrderPlacementService];
export { OrderPlacementService };
