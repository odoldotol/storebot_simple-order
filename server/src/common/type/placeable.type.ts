import { Payable } from './payable.type';

export type Placeable = Payable & {
  nickname: string;
  pg_token: string;
};
