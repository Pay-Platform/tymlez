import assert from 'assert';
import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

assert(process.env.METER_DB_HOST, `METER_DB_HOST is missing`);
assert(process.env.METER_DB_USERNAME, `METER_DB_USERNAME is missing`);
assert(process.env.METER_DB_PASSWORD, `METER_DB_PASSWORD is missing`);

const config: Knex.Config = {
  client: 'pg',
  connection: `postgresql://${process.env.METER_DB_USERNAME}:${process.env.METER_DB_PASSWORD}@${process.env.METER_DB_HOST}:8812/qdb`,
};

export default config;
