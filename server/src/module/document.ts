/* [실험중] 시각화 도구

그냥 필요 없는것같아.. 이미 중앙화 하면서 코드가 곧 문서임.

@Todo
- 아무 모듈이든 찍고 시스템 그래프 그릴 수 있음.
- 모듈, 프로바이더 등 표기 옵션 기능.
- 계층별 표기 기능.
- production 에서는 필요없음. dev 목적
 */

import { writeFileSync } from 'fs';
import {
  Abstract,
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import {
  GLOBAL_MODULE_METADATA,
  MODULE_METADATA,
} from '@nestjs/common/constants';
import { AppModule } from './index';
import { isType } from '@util';

/**
 * forwardReference 는 처리안함. 에러 던짐.
 */
async function buildDiagram(
  module: DynamicModule | Promise<DynamicModule> | Type | ForwardReference,
): Promise<Diagram> {
  if ('forwardRef' in module) {
    throw new Error(`forwardReference: ${module.toString()}`);
  }

  if (module instanceof Promise) {
    module = await module;
  }

  const result: Diagram = { module: 'Unknown' };

  let global: DynamicModule['global'] = undefined,
    imports: DynamicModule['imports'] | undefined = undefined,
    controllers: DynamicModule['controllers'] | undefined = undefined,
    providers: DynamicModule['providers'] | undefined = undefined,
    exports: DynamicModule['exports'] | undefined = undefined;

  if (isType(module)) {
    result.module = module.name;

    global = Reflect.getMetadata(GLOBAL_MODULE_METADATA, module);
    global !== undefined && console.log('global', global); // 나중에 확인하게 되도록
    imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module);
    controllers = Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, module);
    providers = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, module);
    exports = Reflect.getMetadata(MODULE_METADATA.EXPORTS, module);
  } else {
    for (const k in module) {
      switch (k) {
        case 'module':
          result.module = module[k].name;
          break;
        case 'global':
          global = module[k]!;
          break;
        case 'imports':
          imports = module[k];
          break;
        case 'controllers':
          controllers = module[k];
          break;
        case 'providers':
          providers = module[k];
          break;
        case 'exports':
          exports = module[k];
          break;
      }
    }
  }

  if (global !== undefined) {
    result.global = global;
  }

  if (imports !== undefined) {
    result.imports = await Promise.all(imports.map(buildDiagram));
  }

  if (controllers !== undefined) {
    result.controllers = controllers.map(parseController);
  }

  if (providers !== undefined) {
    result.providers = providers.map(parseProvider);
  }

  if (exports !== undefined) {
    result.exports = exports.map(parseExport);
  }

  if (result.module === 'Unknown') {
    throw new Error(`Unknown module: ${result.toString()}`);
  }
  return result;
}

function parseController(c: Type<any>): string {
  return c.name;
}

function parseProvider(p: Provider): string {
  if ('name' in p) {
    return p.name;
  } else {
    return p.provide.toString();
  }
}

function parseExport(
  e:
    | string
    | symbol
    | Function
    | DynamicModule
    | Provider
    | Abstract<any>
    | ForwardReference,
): string {
  if (typeof e === 'object') {
    if ('module' in e) {
      return e.module.name;
    } else if ('provide' in e) {
      return e.provide.toString();
    } else {
      // forwardReference 왜써? 쓰지마
      throw new Error(`forwardReference: ${e.toString()}`);
    }
  } else if (typeof e === 'function') {
    return e.name;
  } else {
    return e.toString();
  }
}

buildDiagram(AppModule).then(diagram => {
  const outer: any = {};

  const fn = (cur: Diagram, outer: any) => {
    let module: string;

    if ('module' in cur) {
      module = cur['module'];
      outer[module] = {};

      if ('imports' in cur) {
        cur['imports'].forEach(e => {
          fn(e, outer[module]);
        });
      }
    }
    return outer;
  };

  writeFileSync('./temp.app.module.json', JSON.stringify(diagram, null, 2));
  writeFileSync(
    './temp.app.module.m.json',
    JSON.stringify(fn(diagram, outer), null, 2),
  );

  writeFileSync(
    './temp.app.module.m',
    JSON.stringify(fn(diagram, outer), null, 2)
      .split('\n')
      .map(s => {
        // 공백은 제거하지 않고 영문자는 살리고 특수문자만 제거하기
        const n = s.replace(/[^a-zA-Z0-9_ ]/g, '');

        // n 이 공백으로만 이루어져 있다면
        if (n.trim().length === 0) {
          return;
        }

        // 영문자의 뒤쪽 공백은 제거
        return n.slice(2).replace(/\s+$/, '');
      })
      .filter(e => typeof e === 'string')
      .join('\n'),
  );
});

type Diagram = {
  module: string;
  global?: boolean;
  imports?: Diagram[];
  controllers?: string[];
  providers?: string[];
  exports?: string[];
};
