import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { IDoc } from '@tymlez/platform-api-interfaces';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../../../libs/BaseEntity';
import { User } from '../../auth/entities/User.entity';

@Entity()
export class Installer extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  name: string;

  @Property()
  company: string;

  @Property()
  @Unique()
  certificateNo: string;

  @Property()
  certificateUrl: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Property({ type: 'json', nullable: true })
  certificateDocs: IDoc[];

  constructor() {
    super();
    this.id = uuidv4();
  }
}
