import type { IWattwatchersLongEnergyResponseItem } from '@tymlez/backend-libs';
import { ingestMeterEnergies, logger } from '@tymlez/backend-libs';
import { runAllSettled, validateMaybeResults } from '@tymlez/common-libs';
import assert from 'assert';
import type { PubSub } from '@google-cloud/pubsub';
import { getLiveEnergyStream } from './getLiveEnergyStream';

export async function collectAndIngestMeterLive({
  requestId,
  meters,
  pubsub,
  callLimit = 2,
  hoursPerCall = 12,
}: {
  requestId: string;
  meters: {
    meterId: string;
    apiKey: string;
  }[];
  /**
   * Useful to prevent long processing and timeout
   */
  callLimit?: number;
  hoursPerCall?: number;
  pubsub: PubSub;
}) {
  const { METER_LIVE_PUBSUB_TOPIC } = process.env;
  assert(METER_LIVE_PUBSUB_TOPIC, `METER_LIVE_PUBSUB_TOPIC is missing`);

  const results = await runAllSettled(
    meters,
    async (meter) => {
      const nextLiveEnergies = await getLiveEnergyStream({
        meterId: meter.meterId,
        apiKey: meter.apiKey,
        hoursPerCall,
      });

      let liveEnergies: IWattwatchersLongEnergyResponseItem[];
      let callCount = 0;
      do {
        if (callLimit > 0 && callCount++ >= callLimit) {
          logger.info(
            `Skip, because the number of time calls ${callCount} has reached the call limit ${callLimit}`,
          );
          break;
        }

        liveEnergies = await nextLiveEnergies();

        for (const energy of liveEnergies) {
          logger.info({ energy }, 'Publish to %s', METER_LIVE_PUBSUB_TOPIC);
          await pubsub.topic(METER_LIVE_PUBSUB_TOPIC).publishMessage({
            data: Buffer.from(JSON.stringify(energy)),
          });
        }

        await ingestMeterEnergies({
          requestId,
          energyResponses: liveEnergies,
        });
      } while (liveEnergies.length > 0);
    },
    // Run sequentially, due to https://github.com/questdb/questdb/issues/1461
    1,
  );

  validateMaybeResults({
    message: 'Failed to collect and ingest meter live',
    inputs: meters.map((meter) => meter.meterId),
    results,
  });
}
