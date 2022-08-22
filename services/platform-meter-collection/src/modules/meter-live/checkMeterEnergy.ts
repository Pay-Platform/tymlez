import { last, reduce } from 'lodash';
import assert from 'assert';
import {
  logger,
  useMeterDbPool,
  KNOWN_WATTWATCHERS_ERRORS_MAP,
  validateDurationBetweenTimestamps,
} from '@tymlez/backend-libs';
import type { IBootstrap } from '@tymlez/backend-libs';
import { runAllSettled, validateMaybeResults } from '@tymlez/common-libs';
import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import { subMinutes } from 'date-fns';
import { EXPECTED_DURATION } from './constants';

export async function checkMeterEnergy(
  bootstrap: Pick<IBootstrap, 'site_details'>,
) {
  const meterItemsMap = await getMeterItemsMap();

  const meterDetails = Object.values(bootstrap.site_details)
    .map((siteDetail) => Object.values(siteDetail.meter_details))
    .flat();

  const results = await runAllSettled(meterDetails, async (meterDetail) => {
    const meterItems = meterItemsMap[meterDetail.meter_id];

    if (!meterItems || meterItems.length <= 0) {
      throw new Error(`Missing data for ${meterDetail.meter_id}`);
    }

    logger.info(
      `Checking ${meterItems.length} items for ${meterDetail.meter_id}`,
    );

    checkHaveRecentReading(meterItems, meterDetail.meter_id);

    checkReadingsDuration(meterItems, EXPECTED_DURATION, meterDetail.meter_id);

    validateDurationBetweenTimestamps({
      id: meterDetail.meter_id,
      ascItems: meterItems,
      expectedDuration: EXPECTED_DURATION,
      knownErrorsMap: KNOWN_WATTWATCHERS_ERRORS_MAP,
    });
  });

  validateMaybeResults({
    message: 'Meter energy table has wrong data',
    inputs: meterDetails.map((meter) => ({
      meter_id: meter.meter_id,
      label: meter.label,
    })),
    results,
  });
}

function checkHaveRecentReading(
  meterItems: IMeterEnergyItem[],
  meterId: string,
) {
  const thirtyMinutesAgo = subMinutes(new Date(), 20);

  const lastReadingTimestamp = last(meterItems)!.timestamp;
  assert(
    lastReadingTimestamp > thirtyMinutesAgo,
    `For ${meterId}: last reading is from ${lastReadingTimestamp.toISOString()} ` +
      `expect to later than 30 minutes ago: ${thirtyMinutesAgo.toISOString()}.`,
  );
}

function checkReadingsDuration(
  meterItems: IMeterEnergyItem[],
  expectedDuration: ITimeSpanMsec,
  meterId: string,
) {
  meterItems.forEach(({ duration }) => {
    assert(
      duration === expectedDuration,
      `For ${meterId}: duration is ${duration}ms, expect 5 minutes`,
    );
  });
}

async function getMeterItemsMap(): Promise<
  Record<string, IMeterEnergyItem[] | undefined>
> {
  return await useMeterDbPool(async (pool) => {
    const { rows: meterIdWithTimestamps } = (await pool.query(
      `select meter_id, timestamp, duration from 'meter_energy' order by meter_id, timestamp;`,
    )) as { rows: IMeterEnergyItem[] };

    return reduce(
      meterIdWithTimestamps,
      (acc, energy) => {
        if (!acc[energy.meter_id]) {
          acc[energy.meter_id] = [];
        }

        acc[energy.meter_id]!.push(energy);
        return acc;
      },
      {} as Record<string, IMeterEnergyItem[] | undefined>,
    );
  });
}

interface IMeterEnergyItem {
  meter_id: string;
  timestamp: Date;
  duration: ITimeSpanMsec;
}
