import { Migration } from '@mikro-orm/migrations';

export class Migration20220407094301 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
    CREATE TABLE IF NOT EXISTS token_mint(
      id bigserial NOT NULL,
      mint_date timestamp without time zone,
      co2_amount numeric,
      meta json)`);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "token_mint";');
  }
}
