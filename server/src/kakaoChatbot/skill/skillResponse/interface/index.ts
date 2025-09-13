import { SkillResponseV2 } from '../type';

export type ResponseBody<T> = {
  [method in keyof T]: (...args: any[]) => SkillResponseV2;
};
