import type { Storage } from '@google-cloud/storage';
import { logger } from '@tymlez/backend-libs';
import { ingestCarbonEmissions } from './ingestCarbonEmissions';
import {
  getEmissionDataFromStorage,
  IStorageFileInfo,
} from './getEmissionDataFromStorage';
import { getHasLastSettlementDateInDb } from './getHasLastSettlementDateInDb';
import { getLastSettlementDateSameForAllRegionsInDb } from './getLastSettlementDateSameForAllRegionsInDb';

export async function ingestCarbonEmissionLive({
  requestId,
  storageFileInfo,
  storage,
}: {
  requestId: string;
  storageFileInfo: IStorageFileInfo;
  storage: Storage;
}) {
  const carbonEmissions = await getCarbonEmissions({
    storageFileInfo,
    storage,
  });

  await ingestCarbonEmissions({
    requestId,
    carbonEmissions,
  });
}

async function getCarbonEmissions({
  storage,
  storageFileInfo,
}: {
  storageFileInfo: IStorageFileInfo;
  storage: Storage;
}) {
  const carbonEmissions = await getEmissionDataFromStorage({
    storageFileInfo,
    storage,
  });

  const hasLastSettlementDate = await getHasLastSettlementDateInDb();

  if (!hasLastSettlementDate) {
    return carbonEmissions;
  }

  const lastSettlementDate = await getLastSettlementDateSameForAllRegionsInDb();

  return carbonEmissions.filter((carbonEmission) => {
    if (
      new Date(carbonEmission.settlement_date).getTime() >
      lastSettlementDate.getTime()
    ) {
      return true;
    }

    logger.info(
      `For ${carbonEmission.regionid}: Skip carbon emission at ${carbonEmission.settlement_date}, ` +
        `because it is <= ${lastSettlementDate.toISOString()}`,
    );
    return false;
  });
}
