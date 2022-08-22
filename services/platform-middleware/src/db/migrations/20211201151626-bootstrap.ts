import { Migration } from '@mikro-orm/migrations';

export class Migration20211201041626 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "client" ("name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "label" varchar(255) not null);',
    );
    this.addSql(
      'alter table "client" add constraint "client_pkey" primary key ("name");',
    );

    this.addSql(
      'create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "email" varchar(255) not null, "password" varchar(255) not null, "roles" text[] not null, "client_name" varchar(255) not null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "site" ("name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "client_name" varchar(255) not null, "label" varchar(255) not null, "address" varchar(255) not null, "lat" double precision not null, "lng" double precision not null, "has_solar" bool not null, "solcast_resource_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "site" add constraint "site_pkey" primary key ("name");',
    );

    this.addSql(
      'create table "meter" ("name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "meter_id" varchar(255) null, "site_name" varchar(255) not null, "label" varchar(255) not null, "description" varchar(255) not null, "type" varchar(255) not null, "lat" double precision null, "lng" double precision null, "interval" int4 null, "billing_channel_index" int4 null);',
    );
    this.addSql(
      'alter table "meter" add constraint "meter_pkey" primary key ("name");',
    );

    this.addSql(
      'create table "circuit" ("name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "meter_name" varchar(255) not null, "label" varchar(255) not null);',
    );
    this.addSql(
      'alter table "circuit" add constraint "circuit_pkey" primary key ("name");',
    );

    this.addSql(
      'create table "channel" ("name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "tags" text[] not null, "meter_name" varchar(255) not null, "circuit_name" varchar(255) not null, "index" int4 not null, "label" varchar(255) not null);',
    );
    this.addSql(
      'alter table "channel" add constraint "channel_pkey" primary key ("name");',
    );

    this.addSql(
      'alter table "user" add constraint "user_client_name_foreign" foreign key ("client_name") references "client" ("name") on update cascade;',
    );

    this.addSql(
      'alter table "site" add constraint "site_client_name_foreign" foreign key ("client_name") references "client" ("name") on update cascade;',
    );

    this.addSql(
      'alter table "meter" add constraint "meter_site_name_foreign" foreign key ("site_name") references "site" ("name") on update cascade;',
    );

    this.addSql(
      'alter table "circuit" add constraint "circuit_meter_name_foreign" foreign key ("meter_name") references "meter" ("name") on update cascade;',
    );

    this.addSql(
      'alter table "channel" add constraint "channel_meter_name_foreign" foreign key ("meter_name") references "meter" ("name") on update cascade;',
    );
    this.addSql(
      'alter table "channel" add constraint "channel_circuit_name_foreign" foreign key ("circuit_name") references "circuit" ("name") on update cascade;',
    );
  }
}
