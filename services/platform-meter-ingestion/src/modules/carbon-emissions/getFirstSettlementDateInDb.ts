import { useMeterDbPool } from '@tymlez/backend-libs';
import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';
import { AUSTRALIAN_REGIONS } from '@tymlez/common-libs';
import assert from 'assert';
import { first } from 'lodash';

export async function getFirstSettlementDateInDb(): Promise<Date> {
  const firstSettlementDates = await useMeterDbPool(async (pool) => {
    const { rows } = (await pool.query(
      `
        select regionid, first(settlement_date) settlement_date 
        from 'carbon_emissions' 
        group by regionid
        order by settlement_date asc;
      `,
    )) as {
      rows: Pick<ICarbonEmissionDbRow, 'regionid' | 'settlement_date'>[];
    };
    return rows;
  });

  assert(
    firstSettlementDates.length === AUSTRALIAN_REGIONS.length,
    `Number of first carbonEmissionsInDb is ${firstSettlementDates.length}, ` +
      `expect ${AUSTRALIAN_REGIONS.length}`,
  );

  const firstSettlementDate = first(firstSettlementDates)!.settlement_date;

  firstSettlementDates.forEach((carbonEmission) => {
    assert(
      carbonEmission.settlement_date.getTime() ===
        firstSettlementDate?.getTime(),
      `For ${carbonEmission.regionid}: first carbon emission is ` +
        `${carbonEmission.settlement_date.toISOString()}, ` +
        `expect ${firstSettlementDate?.toISOString()}`,
    );
  });

  return firstSettlementDate;
}
