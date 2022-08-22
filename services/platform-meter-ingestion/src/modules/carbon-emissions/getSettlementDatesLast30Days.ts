import { useMeterDbPool } from '@tymlez/backend-libs';
import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';
import { subDays } from 'date-fns';
import { AUSTRALIAN_REGIONS } from '@tymlez/common-libs';
import { getLastSettlementDateInDb } from './getLastSettlementDateInDb';
import { getFirstSettlementDateInDb } from './getFirstSettlementDateInDb';

export async function getSettlementDatesLast30Days() {
  const endDate = await getLastSettlementDateInDb();
  const firstSettlementDate = await getFirstSettlementDateInDb();
  const endDateMinus30 = subDays(endDate, 30);
  const startDate =
    firstSettlementDate > endDateMinus30 ? firstSettlementDate : endDateMinus30;

  return await useMeterDbPool(async (pool) => {
    const sql = `
        (select count_distinct(regionid) as region_count, settlement_date
        from 'carbon_emissions'
        where settlement_date >= $1 and settlement_date < $2
        group by settlement_date
        order by settlement_date asc) where region_count = $3;
    `;

    const params = [startDate, endDate, AUSTRALIAN_REGIONS.length];

    const { rows } = (await pool.query(sql, params)) as {
      rows: Pick<ICarbonEmissionDbRow, 'settlement_date'>[];
    };

    return rows.map((i) => i.settlement_date.toISOString());
  });
}
