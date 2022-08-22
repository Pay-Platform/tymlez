/* eslint-disable camelcase */
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type {
  ILatitude,
  ILongitude,
  IMeter,
  IMeterReadingType,
  IMeterStatus,
  ITimestampMsec,
  ITimestampSec,
} from '@tymlez/platform-api-interfaces';
import { BaseEntity } from '../../../libs/BaseEntity';
import { Site } from '../../site/entities/Site.entity';

@Entity()
export class Meter extends BaseEntity implements IMeter {
  @PrimaryKey()
  @Property()
  @Unique()
  name: string;

  @Property({ nullable: true })
  meter_id?: string;

  @ManyToOne(() => Site)
  site: Site;

  @Property()
  label: string;

  @Property({ nullable: true })
  isMain?: boolean;

  @Property()
  description: string;

  @Property({ type: 'string' })
  type: IMeterReadingType;

  @Property({ columnType: 'double precision', nullable: true })
  lat?: ILatitude;

  @Property({ columnType: 'double precision', nullable: true })
  lng?: ILongitude;

  @Property({ type: 'number', nullable: true })
  interval?: ITimestampSec;

  @Property({ nullable: true })
  billingChannelIndex?: number;

  @Property({ type: 'string', nullable: true })
  apiKey?: string;

  @Property({ type: 'string' })
  status: IMeterStatus;

  @Property({ type: 'string', nullable: true })
  activeFrom?: ITimestampMsec;
}
