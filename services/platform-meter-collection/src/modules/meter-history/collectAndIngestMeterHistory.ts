import type { IWattwatchersLongEnergyResponseItem } from '@tymlez/backend-libs';
import { ingestMeterEnergies } from '@tymlez/backend-libs';
import { runAllSettled, validateMaybeResults } from '@tymlez/common-libs';
import { getHistoricalEnergyStream } from './getHistoricalEnergyStream';

export async function collectAndIngestMeterHistory({
  requestId,
  meters,
}: {
  requestId: string;
  meters: {
    meterId: string;
    apiKey: string;
  }[];
}) {
  const results = await runAllSettled(
    meters,
    async (meter) => {
      const nextHistoricalEnergies = await getHistoricalEnergyStream({
        meterId: meter.meterId,
        apiKey: meter.apiKey,
      });

      let historicalEnergies: IWattwatchersLongEnergyResponseItem[];
      do {
        historicalEnergies = await nextHistoricalEnergies();

        await ingestMeterEnergies({
          requestId,
          energyResponses: historicalEnergies,
          skipCheckExists: true,
        });
      } while (historicalEnergies.length > 0);
    },
    // Run sequentially, due to https://github.com/questdb/questdb/issues/1461
    1,
  );

  validateMaybeResults({
    message: 'Failed to collect and ingest meter history',
    inputs: meters.map((meter) => meter.meterId),
    results,
  });
}
