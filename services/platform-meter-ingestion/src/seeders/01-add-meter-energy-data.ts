import type { Pool, ClientBase } from 'pg';
import type { IBootstrap } from '@tymlez/backend-libs';
import { addMinutes, subDays } from 'date-fns';
import pLimit from 'p-limit';
import { logger } from '@tymlez/backend-libs';
import INITIAL_DATA from './pubsub-msg.json';

const MAX_NUM_CHANNELS = 6;

export async function up(
  client: ClientBase,
  config: {
    BOOTSTRAP_DATA: IBootstrap;
  },
): Promise<void> {
  const siteDetails = config.BOOTSTRAP_DATA.site_details.main;
  const meters = Object.keys(siteDetails.meter_details);
  const koefs = Array.from(Array(meters.length).keys(), (_v, k) => k / 1000);
  const text = `INSERT INTO meter_energy VALUES(${Array.from(
    Array(5 + MAX_NUM_CHANNELS * 10).keys(),
    (_v, k) => `$${k + 1}`,
  ).join(', ')});`;
  const queries = [];
  const today = new Date();
  let timestamp = subDays(today, 2);
  while (timestamp.getTime() <= today.getTime()) {
    let dataIndex = 0;
    for (const k of meters) {
      const meterIndex = meters.indexOf(k);
      const row = INITIAL_DATA[dataIndex];
      queries.push(
        client.query({
          name: 'insert data',
          text,
          values: [
            siteDetails.meter_details[k].meter_id,
            timestamp.toISOString(),
            row.duration,
            ...row.eRealKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.eRealNegativeKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.eRealPositiveKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.eReactiveKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.eReactiveNegativeKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.eReactivePositiveKwh
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.iRMSMin
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.iRMSMax
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.vRMSMin
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            ...row.vRMSMax
              .slice(0, MAX_NUM_CHANNELS)
              .map((v) => v + koefs[meterIndex]),
            `local_seeder_generated_data_${dataIndex}`,
            new Date().toISOString(),
          ],
        }),
      );
      // koef1 += 0.001;
    }
    dataIndex++;
    if (dataIndex > INITIAL_DATA.length - 1) {
      dataIndex = 0;
    }
    timestamp = addMinutes(timestamp, 5);
  }
  const limit = pLimit(8);
  logger.info('before %s', queries.length, new Date());
  await Promise.all(queries.map((q) => limit(() => q)));
  logger.info('after %s', new Date());
  await client.query('COMMIT');
}

export async function runContinue(
  pool: Pool,
  config: {
    BOOTSTRAP_DATA: IBootstrap;
    interval: number;
  },
): Promise<void> {
  const siteDetails = config.BOOTSTRAP_DATA.site_details.main;
  const meters = Object.keys(siteDetails.meter_details);
  const koefs = Array.from(Array(meters.length).keys(), (_v, k) => k / 1000);
  let index = 0;

  const text = `INSERT INTO meter_energy VALUES(${Array.from(
    Array(5 + MAX_NUM_CHANNELS * 10).keys(),
    (_v, k) => `$${k + 1}`,
  ).join(', ')});`;
  setInterval(() => {
    (async () => {
      try {
        const client = await pool.connect();
        try {
          const curDate = new Date();
          for (const meter of meters) {
            const meterIndex = meters.indexOf(meter);
            const row = INITIAL_DATA[index];
            await client.query(text, [
              siteDetails.meter_details[meter].meter_id,
              curDate.toISOString(),
              row.duration,
              ...row.eRealKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.eRealNegativeKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.eRealPositiveKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.eReactiveKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.eReactiveNegativeKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.eReactivePositiveKwh
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.iRMSMin
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.iRMSMax
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.vRMSMin
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              ...row.vRMSMax
                .slice(0, MAX_NUM_CHANNELS)
                .map((v) => v + koefs[meterIndex]),
              `local_seeder_generated_data`,
              new Date().toISOString(),
            ]);
            logger.info('record inserted ', index, 'meter', meter);
            await client.query('COMMIT');
          }
          if (index === INITIAL_DATA.length - 1) {
            index = 0;
          } else {
            index++;
          }
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
  }, config.interval);
}
