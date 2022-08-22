import type { ClientBase, Pool } from 'pg';
import { startOfDay, subDays, subMinutes } from 'date-fns';
import pLimit from 'p-limit';

import { logger } from '@tymlez/backend-libs';
import INITIAL_DATA from './emissions.json';

export async function up(client: ClientBase): Promise<void> {
  const queries = [];
  const today = new Date();
  const dayBefore = subMinutes(subDays(today, 2), 5);
  const { rows: meterEnergyTimestamps } = await client.query(
    `select distinct meter_energy.timestamp, carbon_emissions.settlement_date 
    from meter_energy 
    left join carbon_emissions 
    on meter_energy.timestamp = carbon_emissions.settlement_date 
    where carbon_emissions.settlement_date = null 
    and meter_energy.timestamp >= $1;`,
    [dayBefore.toISOString()],
  );
  logger.info(
    'meter energy timestamps without carbon emissions length %s',
    meterEnergyTimestamps.length,
  );
  for (const timestamp of meterEnergyTimestamps.map((m) => m.timestamp)) {
    for (const { row } of INITIAL_DATA.map((data, i) => ({
      row: data,
      index: i,
    }))) {
      const emissions = Number(row.emission) * Math.random();
      const energy = Number(row.energy) * Math.random();
      const factor = emissions / energy;
      queries.push(
        client.query(
          `INSERT INTO carbon_emissions VALUES($1, $2, $3, $4, $5, $6, $7);`,
          [
            row.regionid,
            energy,
            emissions,
            factor,
            timestamp.toISOString(),
            'seed',
            new Date().toISOString(),
          ],
        ),
      );
    }
  }
  const limit = pLimit(10);
  await Promise.all(queries.map((q) => limit(() => q)));
  await client.query('COMMIT');
  // await insertChunkRecords(client, queries, 5);
  logger.info('carbon emissions records added');
}

const getLastTimestamp = async (
  client: ClientBase,
  tableName: string,
  timestmpColumnName: string,
): Promise<Date | undefined> => {
  const { rows } = await client.query(
    `select ${timestmpColumnName} from ${tableName} limit -1;`,
  );
  if (rows.length === 0) {
    return;
  }
  return rows[0][timestmpColumnName];
};

export async function runContinue(
  pool: Pool,
  config: {
    interval: number;
  },
): Promise<void> {
  logger.info('start seed:continue carbon-emissions');
  const text = `INSERT INTO carbon_emissions VALUES($1, $2, $3, $4, $5, $6, $7);`;
  setInterval(() => {
    (async () => {
      try {
        const client = await pool.connect();
        try {
          const lastEmissionRecordTimestamp = await getLastTimestamp(
            client,
            'carbon_emissions',
            'settlement_date',
          );
          const today = startOfDay(new Date());
          const dayBefore = subDays(today, 2);
          const values = [];
          if (
            lastEmissionRecordTimestamp &&
            lastEmissionRecordTimestamp > dayBefore
          ) {
            values.push(lastEmissionRecordTimestamp.toISOString());
          } else {
            values.push(dayBefore.toISOString());
          }
          const { rows: timestamps } = await client.query(
            'select distinct timestamp from meter_energy where timestamp > $1',
            values,
          );

          const queries = [];

          for (const { timestamp } of timestamps) {
            logger.info('insert carbon at', timestamp);
            for (const row of INITIAL_DATA) {
              const emissions = Number(row.emission) * Math.random();
              const energy = Number(row.energy) * Math.random();
              const factor = emissions / energy;
              queries.push(
                client.query(text, [
                  row.regionid,
                  energy,
                  emissions,
                  factor,
                  timestamp.toISOString(),
                  'seed',
                  new Date().toISOString(),
                ]),
              );
            }
          }
          logger.info('emission records inserted', queries.length);
          await Promise.all(queries);
          await client.query('COMMIT');
        } catch (err) {
          logger.error({ err }, 'Cannot connect to client');
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      } finally {
        // await client.end();
      }
    })();
  }, config.interval / 2);
}
