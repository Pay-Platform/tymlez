import { Migration } from '@mikro-orm/migrations';

export class Migration2021205041224 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
      ALTER TABLE meter
      ADD COLUMN api_key varchar(255) null,                 
      ADD COLUMN active_from timestamp(0) with time zone null,
      ADD COLUMN status boolean;
      `,
    );
  }
}
