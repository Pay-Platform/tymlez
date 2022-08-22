import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Battery {
  @PrimaryKey()
  id: bigint;

  @Property()
  ts: string;

  @Property()
  register: string;

  @Property()
  current: number;

  @Property()
  soc_pc: number;
}
