import { Payable } from './payable.type';

export type Placeable = Payable & {
  user_id: string;
  nickname: string;
  pg_token: string;
};
