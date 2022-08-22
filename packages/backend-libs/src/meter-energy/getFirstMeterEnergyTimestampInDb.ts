import assert from 'assert';
import { useMeterDbPool } from '../meter-db';

export async function getFirstMeterEnergyTimestampInDb({
  meterId,
  minTimestamp,
}: {
  meterId?: string;
  minTimestamp?: Date;
} = {}): Promise<Date> {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (
      meterId
        ? await pool.query(
            `
              select first(timestamp) timestamp from 'meter_energy'
              where meter_id = $1;
            `,
            [meterId],
          )
        : await pool.query(
            `
              select first(timestamp) timestamp from 'meter_energy';
            `,
          )
    ) as { rows: { timestamp: Date }[] };

    assert(
      rows.length === 1,
      `Number of first meter energies is ${rows.length}, expect 1`,
    );

    if (minTimestamp && rows[0].timestamp.getTime() < minTimestamp.getTime()) {
      return minTimestamp;
    }

    return rows[0].timestamp;
  });
}
