/* [실험중] 시각화 도구

그냥 필요 없는것같아.. 이미 중앙화 하면서 코드가 곧 문서임.

@Todo
- 아무 모듈이든 찍고 시스템 그래프 그릴 수 있음.
- 모듈, 프로바이더 등 표기 옵션 기능.
- 계층별 표기 기능.
- production 에서는 필요없음. dev 목적
 */

import { DynamicModule } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { AppModule } from './index';

/**
 * @Todo 메타데이타로 정의하는 것 등 모든 모듈의 의존성 그래프 만들어줘여함
 */
async function buildDiagram(module: DynamicModule): Promise<Diagram> {
  const dia: Diagram = { module: 'Unknown' };
  for (const k in module) {
    switch (k) {
      case 'module':
        dia.module = module[k].name;
        break;
      case 'global':
        dia.global = module[k]!;
        break;
      case 'imports':
        dia.imports = await Promise.all(
          module[k]!.map(async m => {
            if ('module' in m) {
              return buildDiagram(m);
            } else if (m instanceof Promise) {
              return await m.then(buildDiagram);
            } else {
              throw new Error(`Not DynamicModule: ${m.toString()}`);
            }
          }),
        );
        break;
      case 'controllers':
        dia.controllers = module[k]!.map(c => c.name);
        break;
      case 'providers':
        dia.providers = module[k]!.map(p => {
          if ('name' in p) {
            return p.name;
          } else {
            return p.provide.toString();
          }
        });
        break;
      case 'exports':
        dia.exports = module[k]!.map(e => {
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
        });
        break;
    }
  }
  if (dia.module === 'Unknown') {
    throw new Error(`Unknown module: ${dia.toString()}`);
  }
  return dia;
}

buildDiagram(AppModule).then(dia => {
  const outer: any = {};

  const fn = (curdia: Diagram, outer: any) => {
    let module: string;

    if ('module' in curdia) {
      module = curdia['module'];
      outer[module] = {};

      if ('imports' in curdia) {
        curdia['imports'].forEach(e => {
          fn(e, outer[module]);
        });
      }
    }
    return outer;
  };

  const mdia = fn(dia, outer);
  writeFileSync('./app.module.m.json', JSON.stringify(mdia, null, 2));
  writeFileSync('./app.module.json', JSON.stringify(dia, null, 2));
});

type Diagram = {
  module: string;
  global?: boolean;
  imports?: Diagram[];
  controllers?: string[];
  providers?: string[];
  exports?: string[];
};
