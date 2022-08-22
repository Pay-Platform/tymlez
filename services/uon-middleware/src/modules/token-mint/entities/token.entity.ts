import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class TokenMint {
  @PrimaryKey()
  id!: number;

  @Property()
  mintDate: Date;

  @Property({ fieldName: 'co2_amount' })
  co2Amount: number;

  @Property()
  meta!: any;
}
