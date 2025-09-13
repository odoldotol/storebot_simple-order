import { ConsoleLogger } from './console';
import { SilentLogger } from './silent';

const isTestEnvironment =
  process.env['NODE_ENV'] === 'test' ||
  process.env['JEST_WORKER_ID'] !== undefined;

export const DefaultLogger = isTestEnvironment ? SilentLogger : ConsoleLogger;
