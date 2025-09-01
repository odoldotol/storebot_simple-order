import { Type } from "@nestjs/common";

export const isType = (value: any): value is Type => {
  return true;
};