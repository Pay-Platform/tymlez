import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../../../libs/BaseEntity';

@Entity()
export class Client extends BaseEntity {
  @PrimaryKey()
  @Property()
  @Unique()
  name: string;

  @Property()
  label: string;
}
