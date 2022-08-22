import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { ICircuit } from '@tymlez/platform-api-interfaces';
import { BaseEntity } from '../../../libs/BaseEntity';
import { Meter } from './Meter.entity';

@Entity()
export class Circuit extends BaseEntity implements ICircuit {
  @PrimaryKey()
  @Property()
  @Unique()
  name: string;

  @ManyToOne(() => Meter)
  meter: Meter;

  @Property()
  label: string;
}
