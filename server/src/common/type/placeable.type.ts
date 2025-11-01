import { Orderable } from './orderable.type';
import { Payable } from './payable.type';

export type Placeable = Orderable & Payable;
