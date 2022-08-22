import { range } from 'lodash';
import type { ClientBase } from 'pg';
import { logger } from '@tymlez/backend-libs';

const MAX_NUM_CHANNELS = 6;

export async function up(client: ClientBase): Promise<void> {
  // Used the same unified schema as in the BigQuery
  const query = `
    CREATE TABLE IF NOT EXISTS meter_energy (
      meter_id STRING, 
      timestamp TIMESTAMP,
      duration INT,

      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eRealKwh_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eRealNegativeKwh_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eRealPositiveKwh_${i} DOUBLE`)
        .join(',\n')},

      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eReactiveKwh_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eReactiveNegativeKwh_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `eReactivePositiveKwh_${i} DOUBLE`)
        .join(',\n')},

      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `iRMSMin_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `iRMSMax_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `vRMSMin_${i} DOUBLE`)
        .join(',\n')},
      ${range(0, MAX_NUM_CHANNELS)
        .map((i) => `vRMSMax_${i} DOUBLE`)
        .join(',\n')},

      requestId STRING,
      createdAt TIMESTAMP

    ) timestamp(timestamp)
    PARTITION BY DAY;
  `;

  await client.query(query);
}

export async function down(client: ClientBase): Promise<void> {
  const { rows } = await client.query('SHOW TABLES');
  if (rows.map((r) => r.table).includes('meter_energy')) {
    await client.query('DROP TABLE "meter_energy"');
  } else {
    logger.info('meter_energy table does not exist');
  }
}
