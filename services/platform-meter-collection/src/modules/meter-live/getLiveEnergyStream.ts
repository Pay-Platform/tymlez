/* eslint-disable camelcase */
import {
  fetchLatestLongEnergies,
  fetchLongEnergy,
  IWattwatchersLongEnergyResponseItem,
  logger,
  useMeterDbPool,
  KNOWN_WATTWATCHERS_ERRORS_MAP,
  validateDurationBetweenTimestamps,
} from '@tymlez/backend-libs';
import assert from 'assert';
import { last } from 'lodash';
import { addHours, addSeconds, subDays } from 'date-fns';
import { toTimestampSec } from '@tymlez/common-libs';
import { EXPECTED_DURATION } from './constants';

export async function getLiveEnergyStream({
  meterId,
  apiKey,
  hoursPerCall,
}: {
  meterId: string;
  apiKey: string;
  hoursPerCall: number;
}) {
  const lastEnergyInDb = await getLastEnergyInDb(meterId);
  const lastEnergyInWattwatchers = await getLatestEnergyInWattwatchers(
    meterId,
    apiKey,
  );

  let fromDate = lastEnergyInDb?.timestamp
    ? addSeconds(lastEnergyInDb.timestamp, 1)
    : subDays(new Date(), 1);

  let cachedFromEnergy = lastEnergyInDb
    ? {
        timestamp: toTimestampSec(lastEnergyInDb.timestamp),
      }
    : undefined;

  return async function next(): Promise<IWattwatchersLongEnergyResponseItem[]> {
    let energies: IWattwatchersLongEnergyResponseItem[] = [];

    const lastEnergyInWattwatchersTimestamp = new Date(
      lastEnergyInWattwatchers.timestamp * 1000,
    );

    if (fromDate < lastEnergyInWattwatchersTimestamp) {
      const toDate = addHours(fromDate, hoursPerCall);
      energies = await fetchLongEnergy({
        deviceId: meterId,
        apiKey,
        fromDate,
        toDate,
      });

      assert(
        energies.length > 0,
        `No energy found for ${JSON.stringify({
          deviceId: meterId,
          fromDate,
          toDate,
        })}`,
      );

      fromDate = addSeconds(new Date(last(energies)!.timestamp * 1000), 1);
    } else {
      logger.info(
        `For ${meterId}: skip because Wattwatchers doesn't have more data since ${fromDate.toISOString()}, ` +
          `the latest Wattwatchers data available is ${lastEnergyInWattwatchersTimestamp.toISOString()}`,
      );
    }

    validateDurationBetweenTimestamps({
      id: meterId,
      expectedDuration: EXPECTED_DURATION,
      ascItems: [
        ...(cachedFromEnergy ? [cachedFromEnergy] : []),
        ...energies,
      ].map((item) => ({
        timestamp: new Date(item.timestamp * 1000),
      })),
      knownErrorsMap: KNOWN_WATTWATCHERS_ERRORS_MAP,
    });

    cachedFromEnergy = last(energies);

    return energies;
  };
}

async function getLastEnergyInDb(
  meterId: string,
): Promise<IMeterIdWithTimestamp | undefined> {
  return await useMeterDbPool(async (pool) => {
    const { rows: lastEnergies } = (await pool.query(
      `
        SELECT meter_id, timestamp FROM 'meter_energy' 
        LATEST BY meter_id
        WHERE meter_id = $1;
      `,
      [meterId],
    )) as { rows: IMeterIdWithTimestamp[] };

    return lastEnergies[0];
  });
}

async function getLatestEnergyInWattwatchers(
  meterId: string,
  apiKey: string,
): Promise<IWattwatchersLongEnergyResponseItem> {
  const [latestEnergy] = await fetchLatestLongEnergies({
    requests: [
      {
        deviceId: meterId,
        apiKey,
      },
    ],
  });

  if (latestEnergy instanceof Error) {
    throw latestEnergy;
  }

  return latestEnergy;
}

interface IMeterIdWithTimestamp {
  meter_id: string;
  timestamp: Date;
}
