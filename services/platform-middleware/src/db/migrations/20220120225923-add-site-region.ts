import { Migration } from '@mikro-orm/migrations';

export class Migration20220120225923 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "site" add column "region" varchar(255) null;');
  }
}
