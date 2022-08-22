/* eslint-disable no-process-env */

import assert from 'assert';
import { Pool, PoolConfig } from 'pg';
import { isNumeric } from '@tymlez/common-libs';

export const getMeterDbPool = ({
  METER_DB_DATABASE = process.env.METER_DB_DATABASE,
  METER_DB_HOST = process.env.METER_DB_HOST,
  METER_DB_PORT = process.env.METER_DB_PORT,
  METER_DB_USERNAME = process.env.METER_DB_USERNAME,
  METER_DB_PASSWORD = process.env.METER_DB_PASSWORD,
}: IGetMeterDbPoolOptions = {}): Pool => {
  assert(METER_DB_DATABASE, 'METER_DB_DATABASE is missing');
  assert(METER_DB_HOST, 'METER_DB_HOST is missing');
  assert(METER_DB_PORT, 'METER_DB_PORT is missing');
  assert(
    isNumeric(METER_DB_PORT),
    `METER_DB_PORT: "${METER_DB_PORT}" is not a number.`,
  );
  assert(METER_DB_USERNAME, 'METER_DB_USERNAME is missing');
  assert(METER_DB_PASSWORD, 'METER_DB_PASSWORD is missing');

  const config: PoolConfig = {
    database: METER_DB_DATABASE,
    host: METER_DB_HOST,
    port: parseInt(METER_DB_PORT, 10),
    user: METER_DB_USERNAME,
    password: METER_DB_PASSWORD,
  };

  return new Pool(config);
};

export interface IGetMeterDbPoolOptions {
  METER_DB_DATABASE?: string;
  METER_DB_HOST?: string;
  METER_DB_PORT?: string;
  METER_DB_USERNAME?: string;
  METER_DB_PASSWORD?: string;
}
