import { Migration } from '@mikro-orm/migrations';

export class Migration20220406131620 extends Migration {
  async up(): Promise<void> {
    await this.execute(
      'CREATE TABLE IF NOT EXISTS "setting" ("key" character varying(255) not null, "value" character varying(255) not null, raw json);',
    );
    const defaultCo2Factor = { key: 'co2_factor', value: 2.709 };
    const createClient = this.getKnex()
      .insert({
        ...defaultCo2Factor,
        raw: defaultCo2Factor,
      })
      .returning('key')
      .into('setting');
    await this.execute(createClient);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "setting";');
  }
}
