import { StoreStateModule } from '@module';
import { StoreStateRepository } from './state.repository';
import { StoreStateService } from './state.service';

StoreStateModule.providers = [StoreStateRepository, StoreStateService];

StoreStateModule.exports = [StoreStateService];
