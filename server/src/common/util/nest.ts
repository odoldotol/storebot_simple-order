import { Type } from '@nestjs/common';

export function isType(value: any): value is Type {
  if (
    value &&
    value instanceof Function &&
    value.prototype?.constructor === value
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @CommonJS
 */
export function collectNestType(module: NodeJS.Module): Type[] {
  return Object.values(module.exports).filter(isType);
}
