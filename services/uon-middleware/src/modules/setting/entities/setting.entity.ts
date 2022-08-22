import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import type { IKeyPairdValue } from './model';

@Entity()
export class Setting {
  @PrimaryKey()
  key: string;

  @Property()
  value: string;

  @Property()
  raw: IKeyPairdValue;
}
