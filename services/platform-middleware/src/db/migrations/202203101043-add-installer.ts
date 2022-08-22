import { Migration } from '@mikro-orm/migrations';

export class Migration2021203101043 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
      CREATE TABLE IF NOT EXISTS installer
        (
            id varchar(255) not null,
            name varchar(255) not null,
            company varchar(255) not null,
            certificate_no varchar(255) not null,
            certificate_url varchar(255), 
            created_by_id varchar(255),
            certificate_docs json not null,
            created_at timestamptz(0) not null,
            updated_at timestamptz(0) not null, 
            tags text[] not null,
            CONSTRAINT installer_pkey PRIMARY KEY (id),
            CONSTRAINT installer_certificate_no_unique UNIQUE (certificate_no)
        );

      `,
    );
  }
}
