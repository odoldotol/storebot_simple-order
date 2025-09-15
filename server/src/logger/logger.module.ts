import { LoggerModule } from '@module';
import { ConsoleLogger } from './console';

LoggerModule.providers = [ConsoleLogger];
LoggerModule.exports = [ConsoleLogger];
