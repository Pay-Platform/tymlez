/* eslint-disable camelcase */
import {
  fetchFirstLongEnergies,
  fetchLongEnergy,
  IWattwatchersLongEnergyResponseItem,
  logger,
  useMeterDbPool,
  KNOWN_WATTWATCHERS_ERRORS_MAP,
  validateDurationBetweenTimestamps,
} from '@tymlez/backend-libs';
import { subDays } from 'date-fns';
import assert from 'assert';
import type { ITimestampSec } from '@tymlez/platform-api-interfaces';
import { toTimestampSec } from '@tymlez/common-libs';
import { first } from 'lodash';
import { EXPECTED_DURATION } from './constants';

/**
 * Return historical energies in reverse time order
 */
export async function getHistoricalEnergyStream({
  meterId,
  apiKey,
}: {
  meterId: string;
  apiKey: string;
}) {
  const firstEnergyInDb = await getFirstEnergyInDb(meterId);
  const firstEnergyInWattwatchers = await getFirstEnergyInWattwatchers(
    meterId,
    apiKey,
  );

  const firstEnergyInWattwatchersTimestamp = new Date(
    firstEnergyInWattwatchers.timestamp * 1000,
  );

  let toDate = firstEnergyInDb.timestamp;
  let cachedToEnergy: { timestamp: ITimestampSec } | undefined = {
    timestamp: toTimestampSec(firstEnergyInDb.timestamp),
  };

  return async function next(): Promise<IWattwatchersLongEnergyResponseItem[]> {
    let energies: IWattwatchersLongEnergyResponseItem[] = [];

    const fromDate = subDays(toDate, 7);

    if (toDate > firstEnergyInWattwatchersTimestamp) {
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

      toDate = new Date(energies[0].timestamp * 1000);
    } else {
      logger.info(
        `For ${meterId}: skip because Wattwatchers doesn't have data before ${toDate.toISOString()}, ` +
          `the first Wattwatchers data available is ${firstEnergyInWattwatchersTimestamp.toISOString()}`,
      );
    }

    validateDurationBetweenTimestamps({
      id: meterId,
      expectedDuration: EXPECTED_DURATION,
      ascItems: [...energies, ...(cachedToEnergy ? [cachedToEnergy] : [])].map(
        (item) => ({
          timestamp: new Date(item.timestamp * 1000),
        }),
      ),
      knownErrorsMap: KNOWN_WATTWATCHERS_ERRORS_MAP,
    });

    cachedToEnergy = first(energies);

    return energies.slice().reverse();
  };
}

async function getFirstEnergyInDb(
  meterId: string,
): Promise<IMeterIdWithTimestamp> {
  return await useMeterDbPool(async (pool) => {
    const { rows: firstEnergies } = (await pool.query(
      `select meter_id, first(timestamp) timestamp from 'meter_energy' where meter_id = $1 group by meter_id;`,
      [meterId],
    )) as { rows: IMeterIdWithTimestamp[] };

    assert(
      firstEnergies.length === 1,
      `Number of firstEnergies in DB for ${meterId} is ${firstEnergies.length}, expect 1.`,
    );
    return firstEnergies[0];
  });
}

async function getFirstEnergyInWattwatchers(
  meterId: string,
  apiKey: string,
): Promise<IWattwatchersLongEnergyResponseItem> {
  const [firstEnergy] = await fetchFirstLongEnergies({
    requests: [
      {
        deviceId: meterId,
        apiKey,
      },
    ],
  });

  if (firstEnergy instanceof Error) {
    throw firstEnergy;
  }

  return firstEnergy;
}

interface IMeterIdWithTimestamp {
  meter_id: string;
  timestamp: Date;
}
