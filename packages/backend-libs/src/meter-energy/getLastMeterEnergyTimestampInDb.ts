import assert from 'assert';
import { useMeterDbPool } from '../meter-db';

export async function getLastMeterEnergyTimestampInDb({
  meterId,
}: {
  meterId?: string;
}): Promise<Date> {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (
      meterId
        ? await pool.query(
            `
              select last(timestamp) timestamp from 'meter_energy'
              where meter_id = $1;
            `,
            [meterId],
          )
        : await pool.query(
            `
              select last(timestamp) timestamp from 'meter_energy';
            `,
          )
    ) as { rows: { timestamp: Date }[] };

    assert(
      rows.length === 1,
      `Number of last meter energies is ${rows.length}, expect 1`,
    );

    return rows[0].timestamp;
  });
}
