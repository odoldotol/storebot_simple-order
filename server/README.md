# Simple Order Server

<br>
...
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

# Architecture Guidelines

<br>

## Module System

- [module](./src/module/index.ts) 파일에서 정의하고 각 모듈폴더([ex](./src/order/placement/)) 내의 모듈파일([ex](./src/order/placement/placement.module.ts)) 에서 완성할것.
- 각 모듈 폴더에서는 index 로 export 만 내보내는 것을 권장.
- 각 모듈 폴더에서는 절대 모듈을 내보내지 말 것.

<br>

## File Organization

[Api Spec](./src/apiSpec/) <br>
[Common](./src/common/) <br>
[Module](./src/module/) <br>

<br>