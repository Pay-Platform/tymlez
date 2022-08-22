import { getLastSettlementDatesByRegionInDb } from './getLastSettlementDatesByRegionInDb';

export async function getHasLastSettlementDateInDb(): Promise<boolean> {
  const lastSettlementDates = await getLastSettlementDatesByRegionInDb();
  return lastSettlementDates.length > 0;
}
