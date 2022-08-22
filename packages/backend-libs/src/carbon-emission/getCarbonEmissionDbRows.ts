import type { AustralianRegion } from '@tymlez/common-libs';
import type { ICarbonEmissionDbRow } from './ICarbonEmissionDbRow';
import { useMeterDbPool } from '../meter-db';

export async function getCarbonEmissionDbRows({
  region,
  fromTimestamp,
  toTimestamp,
}: {
  region: AustralianRegion;
  fromTimestamp: Date;
  toTimestamp: Date;
}) {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (await pool.query(
      `
        select * from 'carbon_emissions'
        where regionid = $1
          and settlement_date >= $2
          and settlement_date < $3
        order by settlement_date;
      `,
      [region, fromTimestamp.toISOString(), toTimestamp.toISOString()],
    )) as { rows: ICarbonEmissionDbRow[] };

    return rows;
  });
}
