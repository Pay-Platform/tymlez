import { Migration } from '@mikro-orm/migrations';

export class Migration2021205041224 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
      ALTER TABLE meter
      ALTER COLUMN status TYPE varchar(255);
      `,
    );
  }
}
