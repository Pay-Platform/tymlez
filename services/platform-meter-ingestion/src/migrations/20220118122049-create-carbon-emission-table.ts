import type { ClientBase } from 'pg';
import { logger } from '@tymlez/backend-libs';

const TABLE_NAME = 'carbon_emissions';

export async function up(client: ClientBase): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      regionid STRING,
      energy DOUBLE,
      emission DOUBLE,
      factor DOUBLE,
      settlement_date TIMESTAMP,
      requestId STRING,
      createdAt TIMESTAMP
    ) timestamp(settlement_date)
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
