import { useMeterDbPool } from '@tymlez/backend-libs';
import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';

export async function getLastSettlementDatesByRegionInDb() {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (await pool.query(
      `
        select regionid, last(settlement_date) settlement_date 
        from 'carbon_emissions' 
        group by regionid
        order by settlement_date asc;
      `,
    )) as {
      rows: Pick<ICarbonEmissionDbRow, 'regionid' | 'settlement_date'>[];
    };
    return rows;
  });
}
