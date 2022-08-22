import assert from 'assert';
import { startOfDay, subDays } from 'date-fns';
import {
  getFirstMeterEnergyTimestampInDb,
  FIRST_CARBON_EMISSION_TIMESTAMP,
} from '@tymlez/backend-libs';
import { getCarbonEmissionsInDbStream } from './getCarbonEmissionsInDbStream';
import { getFirstSettlementDateInDb } from './getFirstSettlementDateInDb';
import { getLastSettlementDateInDb } from './getLastSettlementDateInDb';

export async function checkCarbonEmission() {
  const nextCarbonEmissionsInDb = await getCarbonEmissionsInDbStream();

  let result: Awaited<ReturnType<typeof nextCarbonEmissionsInDb>>;

  do {
    // nextCarbonEmissionsInDb() will get and validate data
    result = await nextCarbonEmissionsInDb();
  } while (result.hasMoreData);

  await checkFirstCarbonEmission();

  await checkLastCarbonEmission();
}

async function checkFirstCarbonEmission() {
  const firstSettlementDate = await getFirstSettlementDateInDb();

  const firstMeterEnergyTimestampInDb = await getFirstMeterEnergyTimestampInDb({
    minTimestamp: FIRST_CARBON_EMISSION_TIMESTAMP,
  });

  assert(
    firstSettlementDate.getTime() <= firstMeterEnergyTimestampInDb.getTime(),
    `The first carbon emission is ${firstSettlementDate.toISOString()} is not ` +
      `before the first meter energy ${firstMeterEnergyTimestampInDb.toISOString()}`,
  );
}

async function checkLastCarbonEmission() {
  const lastSettlementDate = await getLastSettlementDateInDb();

  const yesterday = startOfDay(subDays(new Date(), 1));
  assert(
    lastSettlementDate.getTime() > yesterday.getTime(),
    `The last carbon emission is ${lastSettlementDate.toISOString()} is not ` +
      `after yesterday ${yesterday.toISOString()}`,
  );
}
