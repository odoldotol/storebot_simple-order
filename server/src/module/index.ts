// @CommonJS

import { DynamicModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

/* 목적
- 관심사 분리
- 독립성, 재사용성
- 코드 위치 논리성
- 의존성 주입 명확성
- 모듈간 의존성 파악 용이성, 모듈 계층구조 명확성 등 모듈 시스템 가시성
 */

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export const PostgresModule: DynamicModule = { module: class Postgres {} };

export const RedisModule: DynamicModule = { module: class Redis {} };

export const RepositoryModule: DynamicModule = {
  module: class Repository {},
  imports: [PostgresModule],
};

export const RedisMessageModule: DynamicModule = {
  module: class RedisMessage {},
  imports: [RedisModule],
};

export const RedisGeneralModule: DynamicModule = {
  module: class RedisGeneral {},
  imports: [RedisModule],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export const MessageModule: DynamicModule = {
  module: class Message {},
  imports: [RedisMessageModule],
};

export const CacheModule: DynamicModule = {
  module: class Cache {},
  imports: [
    RedisGeneralModule, // string_json,
  ],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export const UserRepositoryModule: DynamicModule = {
  module: class UserRepository {},
  imports: [RepositoryModule, CacheModule],
};

export const StoreRepositoryModule: DynamicModule = {
  module: class StoreRepository {},
  imports: [
    RepositoryModule,
    RedisGeneralModule, // geo
    CacheModule,
  ],
};

export const MenuRepositoryModule: DynamicModule = {
  module: class MenuRepository {},
  imports: [
    // json(mvp) // RepositoryModule
    CacheModule,
  ],
};

export const OrderRepositoryModule: DynamicModule = {
  module: class OrderRepository {},
  imports: [RepositoryModule],
};

export const OrderMessageModule: DynamicModule = {
  module: class OrderMessage {},
  imports: [MessageModule],
};
import 'src/order/message/message.module';

export const StoreMessageModule: DynamicModule = {
  module: class StoreMessage {},
  imports: [
    MessageModule,
    RedisGeneralModule, // hash
  ],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export const StoreStateModule: DynamicModule = {
  module: class StoreState {},
  imports: [
    RedisGeneralModule, // hash
    StoreRepositoryModule,
  ],
};
import 'src/store/state/state.module';

export const KakaoChatbotEventModule: DynamicModule = {
  module: class KakaoChatbotEvent {},
  imports: [HttpModule],
};

export const PaymentKakaopayModule: DynamicModule = {
  module: class PaymentKakaopay {},
  imports: [HttpModule],
};
import 'src/payment/kakaopay/kakaopay.module';

export const PaymentSessionModule: DynamicModule = {
  module: class PaymentSession {},
  imports: [
    RedisGeneralModule, // string_json
    PaymentKakaopayModule,
  ],
};
import 'src/payment/session/session.module';

//////////////////////////////////////////////////////////////////

export const UserAuthModule: DynamicModule = {
  module: class UserAuth {},
  imports: [UserRepositoryModule],
};

export const UserNicknameModule: DynamicModule = {
  module: class UserNickname {},
  imports: [
    // OpenAIModule,
    UserRepositoryModule,
  ],
};

export const StoreFinderModule: DynamicModule = {
  module: class StoreFinder {},
  imports: [StoreStateModule, StoreRepositoryModule],
};

export const MenuDocumentModule: DynamicModule = {
  module: class MenuDocument {},
  imports: [MenuRepositoryModule],
};

export const OrderDocumentModule: DynamicModule = {
  module: class OrderDocument {},
  imports: [
    RedisGeneralModule, // string_json
    RedisGeneralModule, // hash
    OrderRepositoryModule,
    OrderMessageModule,
    StoreMessageModule,
  ],
};

export const OrderSessionModule: DynamicModule = {
  module: class OrderSession {},
  imports: [
    RedisGeneralModule, // json
    StoreStateModule,
  ],
};
import 'src/order/session/session.module';

export const OrderPlacementModule: DynamicModule = {
  module: class OrderPlacement {},
  imports: [OrderSessionModule, PaymentSessionModule, OrderMessageModule],
};
import 'src/order/placement/placement.module';

//////////////////////////////////////////////////////////////////

/**
 * [link](./logger/logger.module.ts)
 */
export const LoggerModule: DynamicModule = {
  module: class Logger {},
  global: true,
};
import 'src/logger/logger.module';

export const KakaoChatbotSkillModule: DynamicModule = {
  module: class KakaoChatbotSkill {},
  imports: [
    UserAuthModule,
    UserNicknameModule,
    StoreFinderModule,
    MenuDocumentModule,
    OrderDocumentModule,
    OrderSessionModule,
    OrderPlacementModule,
  ],
};
import 'src/kakaoChatbot/skill/skill.module';

export const OrderApprovalModule: DynamicModule = {
  module: class OrderApproval {},
  imports: [
    PaymentKakaopayModule,
    OrderRepositoryModule,
    OrderMessageModule,
    StoreMessageModule,
  ],
};

export const AlertModule: DynamicModule = {
  module: class Alert {},
  imports: [UserAuthModule, OrderMessageModule, KakaoChatbotEventModule],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export const AppModule: DynamicModule = {
  module: class App {},
  imports: [
    // AopModule(?),
    LoggerModule,
    // ConfigModule,
    KakaoChatbotSkillModule,
    OrderApprovalModule,
    AlertModule,
  ],
};
import 'src/app/app.module';

// [실험중]
import './document';
