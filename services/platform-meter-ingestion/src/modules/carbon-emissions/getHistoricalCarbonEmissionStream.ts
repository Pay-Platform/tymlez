import { format } from 'date-fns';
import type { Storage } from '@google-cloud/storage';
import type { ICarbonEmission } from '@tymlez/backend-libs';
import { runAll } from '@tymlez/common-libs';
import assert from 'assert';
import { logger } from '@tymlez/backend-libs';
import { getEmissionDataFromStorage } from './getEmissionDataFromStorage';
import { getMissingSettlementTimestampsInDb } from './getMissingSettlementTimestampsInDb';

export async function getHistoricalCarbonEmissionStream({
  bucketName,
  storage,
}: {
  bucketName: string;
  storage: Storage;
}) {
  const missingSettlementTimestamps =
    await getMissingSettlementTimestampsInDb();

  logger.info(
    'Backfilling missing settlement data %s',
    missingSettlementTimestamps,
  );

  return async function next(): Promise<ICarbonEmission[]> {
    const missingTimestamp = missingSettlementTimestamps.pop();
    if (missingTimestamp !== undefined) {
      const missingDate = new Date(missingTimestamp);

      const filePrefix = `aemo_dispatches/${format(
        missingDate,
        'yyyy',
      )}/${format(missingDate, 'MM')}/${format(missingDate, 'dd')}/${format(
        missingDate,
        'yyyyMMddHHmm',
      )}_`;

      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: filePrefix,
      });

      logger.info(`Loading ${files.length} files from ${filePrefix}`);

      const carbonEmissions = (
        await runAll(
          files,
          async (file) => {
            return await getEmissionDataFromStorage({
              storageFileInfo: {
                bucket: bucketName,
                name: file.name,
              },
              storage,
            });
          },
          2,
        )
      ).flat();

      assert(
        carbonEmissions.length > 0,
        `Carbon Data file is missing at: ${filePrefix}`,
      );

      return carbonEmissions.slice().reverse();
    }

    return [];
  };
}
