import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { BaseEntity } from '../../../libs/BaseEntity';
import { Client } from './Client.entity';

@Entity()
export class User extends BaseEntity {
  constructor(
    email: string,
    password: string,
    roles: string[],
    client: Client,
  ) {
    super();
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.client = client;
    this.id = v4();
  }

  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  @Unique()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  roles: string[];

  @ManyToOne(() => Client)
  client: Client;
}
