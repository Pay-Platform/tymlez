import { AUSTRALIAN_REGIONS } from '@tymlez/common-libs';
import assert from 'assert';
import { first } from 'lodash';
import { getLastSettlementDatesByRegionInDb } from './getLastSettlementDatesByRegionInDb';

export async function getLastSettlementDateInDb(): Promise<Date> {
  const lastSettlementDates = await getLastSettlementDatesByRegionInDb();

  assert(
    lastSettlementDates.length === AUSTRALIAN_REGIONS.length,
    `Number of last carbonEmissionsInDb is ${lastSettlementDates.length}, ` +
      `expect ${AUSTRALIAN_REGIONS.length}`,
  );

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
