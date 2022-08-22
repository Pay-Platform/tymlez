import type { ClientBase } from 'pg';
import { logger } from '@tymlez/backend-libs';

const TABLE_NAME = 'solar_forecast';

export async function up(client: ClientBase): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      resource_id STRING,
      period_end STRING,
      period SYMBOL,
      pv_estimate DOUBLE,
      pv_estimate10 DOUBLE,
      pv_estimate90 DOUBLE,
      forecasted_on TIMESTAMP,
      requestId STRING,
      createdAt TIMESTAMP
    ) timestamp(forecasted_on)
    PARTITION BY DAY;
  `;

  await client.query(query);
}

export async function down(client: ClientBase): Promise<void> {
  const { rows } = await client.query('SHOW TABLES');

  if (rows.map((r) => r.table).includes(TABLE_NAME)) {
    await client.query(`DROP TABLE "${TABLE_NAME}"`);
  } else {
    logger.info(`${TABLE_NAME} table does not exist`);
  }
}
