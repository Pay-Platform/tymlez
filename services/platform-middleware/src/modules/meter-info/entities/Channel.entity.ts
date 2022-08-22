import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { IChannel } from '@tymlez/platform-api-interfaces';
import { BaseEntity } from '../../../libs/BaseEntity';
import { Circuit } from './Circuit.entity';
import { Meter } from './Meter.entity';

@Entity()
export class Channel extends BaseEntity implements IChannel {
  @PrimaryKey()
  @Property()
  @Unique()
  name: string;

  @ManyToOne(() => Meter)
  meter: Meter;

  @ManyToOne(() => Circuit)
  circuit: Circuit;

  @Property()
  index: number;

  @Property()
  label: string;
}
