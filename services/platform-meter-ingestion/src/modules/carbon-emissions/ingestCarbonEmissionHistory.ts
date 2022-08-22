import type { Storage } from '@google-cloud/storage';
import type { ICarbonEmission } from '@tymlez/backend-libs';
import { getHistoricalCarbonEmissionStream } from './getHistoricalCarbonEmissionStream';
import { ingestCarbonEmissions } from './ingestCarbonEmissions';

export async function ingestCarbonEmissionHistory({
  bucketName,
  requestId,
  storage,
}: {
  bucketName: string;
  requestId: string;
  storage: Storage;
}) {
  const nextHistoricalCarbonEmissions = await getHistoricalCarbonEmissionStream(
    {
      bucketName,
      storage,
    },
  );

  let carbonEmissions: ICarbonEmission[];

  do {
    carbonEmissions = await nextHistoricalCarbonEmissions();

    await ingestCarbonEmissions({
      requestId,
      carbonEmissions,
    });
  } while (carbonEmissions.length > 0);
}
