import { DynamicModule } from '@nestjs/common';

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

/**
 * [link](./order/message/message.module.ts)
 */
export const OrderMessageModule: DynamicModule = {
  module: class OrderMessage {},
  imports: [MessageModule],
};

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

/**
 * [link](./store/state/state.module.ts)
 */
export const StoreStateModule: DynamicModule = {
  module: class StoreState {},
  imports: [
    RedisGeneralModule, // hash
    StoreRepositoryModule,
  ],
};

export const KakaoChatbotEventModule: DynamicModule = {
  module: class KakaoChatbotEvent {},
  imports: [
    // HttpModule,
  ],
};

/**
 * [link](./payment/kakaopay/kakaopay.module.ts)
 */
export const PaymentKakaopayModule: DynamicModule = {
  module: class PaymentKakaopay {},
  imports: [
    // HttpModule,
  ],
};

/**
 * [link](./payment/session/session.module.ts)
 */
export const PaymentSessionModule: DynamicModule = {
  module: class PaymentSession {},
  imports: [
    RedisGeneralModule, // string_json
    PaymentKakaopayModule,
  ],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
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

/**
 * [link](./order/session/session.module.ts)
 */
export const OrderSessionModule: DynamicModule = {
  module: class OrderSession {},
  imports: [
    RedisGeneralModule, // json
    StoreStateModule,
  ],
};

/**
 * [link](./order/placement/placement.module.ts)
 */
export const OrderPlacementModule: DynamicModule = {
  module: class OrderPlacement {},
  imports: [OrderSessionModule, PaymentSessionModule, OrderMessageModule],
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

/**
 * [link](./logger/logger.module.ts)
 */
export const LoggerModule: DynamicModule = {
  module: class Logger {},
  global: true,
};

/**
 * [link](./kakaoChatbot/skill/kakaoChatbotSkill.module.ts)
 */
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

/**
 * [link](./app/app.module.ts)
 */
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

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

import '@app';
import '@kakaoChatbot';
import '@logger';
import '@order';
import '@payment';
import '@store';
