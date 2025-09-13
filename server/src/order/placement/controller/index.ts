import { collectNestType } from '@common/util';

export * from './placement.controller';

export const controllers = collectNestType(module);
