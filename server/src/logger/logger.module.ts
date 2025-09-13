import { LoggerModule } from '@modules';
import { ConsoleLogger } from './console';

LoggerModule.providers = [ConsoleLogger];
LoggerModule.exports = [ConsoleLogger];
