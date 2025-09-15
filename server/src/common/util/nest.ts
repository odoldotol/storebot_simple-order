import { ModuleMetadata, Provider, Type } from '@nestjs/common';

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

export function collectNestType(o: any): Type[] {
  return Object.values(o).filter(isType);
}

export function addControllers(
  module: ModuleMetadata,
  o: { [s: string]: Type },
) {
  add('controllers', module, o);
}

export function addProviders(
  module: ModuleMetadata,
  o: { [s: string]: Provider },
) {
  add('providers', module, o);
}

export function addExports(module: ModuleMetadata, o: { [s: string]: Export }) {
  add('exports', module, o);
}

function add(
  str: 'controllers' | 'providers' | 'exports',
  module: ModuleMetadata,
  o: { [s: string]: any },
) {
  module[str] = [...(module[str] ?? []), ...Object.values(o)];
}

type Export = NonNullable<ModuleMetadata['exports']>[number];
