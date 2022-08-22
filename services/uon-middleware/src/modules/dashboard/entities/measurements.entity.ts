import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Measurements {
  @PrimaryKey()
  id: bigint;

  @Property()
  ts: Date;

  @Property({ length: 60 })
  dt: string;

  @Property()
  register: string;

  @Property({ length: 60 })
  val: string;
}
