import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { AustralianRegion } from '@tymlez/common-libs';
import type {
  ILatitude,
  ILongitude,
  ISite,
} from '@tymlez/platform-api-interfaces';
import { BaseEntity } from '../../../libs/BaseEntity';
import { Client } from '../../auth/entities/Client.entity';

@Entity()
export class Site extends BaseEntity implements ISite {
  @PrimaryKey()
  @Property()
  @Unique()
  name: string;

  @ManyToOne(() => Client)
  client: Client;

  @Property()
  label: string;

  @Property()
  address: string;

  @Property({ columnType: 'double precision' })
  lat: ILatitude;

  @Property({ columnType: 'double precision' })
  lng: ILongitude;

  @Property()
  hasSolar: boolean;

  @Property()
  solcastResourceId?: string;

  @Property({ type: 'string', nullable: true })
  region: AustralianRegion;
}
