import { Migration } from '@mikro-orm/migrations';

export class Migration20211207035932 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "meter" add column "is_main" bool null;');

    this.addSql(
      'alter table "client" add constraint "client_name_unique" unique ("name");',
    );

    this.addSql(
      'alter table "site" add constraint "site_name_unique" unique ("name");',
    );

    this.addSql(
      'alter table "meter" add constraint "meter_name_unique" unique ("name");',
    );

    this.addSql(
      'alter table "circuit" add constraint "circuit_name_unique" unique ("name");',
    );

    this.addSql(
      'alter table "channel" add constraint "channel_name_unique" unique ("name");',
    );
  }
}
