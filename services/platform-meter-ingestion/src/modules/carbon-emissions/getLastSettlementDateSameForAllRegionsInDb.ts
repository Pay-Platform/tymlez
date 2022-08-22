import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';
import { useMeterDbPool } from '@tymlez/backend-libs';
import { AUSTRALIAN_REGIONS } from '@tymlez/common-libs';
import assert from 'assert';
import { first, last } from 'lodash';
import { getLastSettlementDatesByRegionInDb } from './getLastSettlementDatesByRegionInDb';

export async function getLastSettlementDateSameForAllRegionsInDb(): Promise<Date> {
  const lastSettlementDates = await getLastSettlementDates();

  const lastSettlementDate = first(lastSettlementDates)!.settlement_date;

  lastSettlementDates.forEach((carbonEmission) => {
    assert(
      carbonEmission.settlement_date.getTime() ===
        lastSettlementDate?.getTime(),
      `For ${carbonEmission.regionid}: last carbon emission is ` +
        `${carbonEmission.settlement_date.toISOString()}, ` +
        `expect ${lastSettlementDate?.toISOString()}`,
    );
  });

  return lastSettlementDate;
}

async function getLastSettlementDates() {
  const lastSettlementDates = await getLastSettlementDatesByRegionInDb();

  assert(
    lastSettlementDates.length === AUSTRALIAN_REGIONS.length,
    `Number of last carbonEmissionsInDb is ${lastSettlementDates.length}, ` +
      `expect ${AUSTRALIAN_REGIONS.length}`,
  );

  const oldestLastSettlementDate = first(lastSettlementDates)!.settlement_date;
  const newestLastSettlementDate = last(lastSettlementDates)!.settlement_date;

  if (
    oldestLastSettlementDate.getTime() === newestLastSettlementDate.getTime()
  ) {
    return lastSettlementDates;
  }

  return await useMeterDbPool(async (pool) => {
    const { rows } = (await pool.query(
      `
          select regionid, settlement_date 
          from 'carbon_emissions' 
          where settlement_date = $1;
        `,
      [oldestLastSettlementDate.toISOString()],
    )) as {
      rows: Pick<ICarbonEmissionDbRow, 'regionid' | 'settlement_date'>[];
    };

    return rows;
  });
}
