import assert from 'assert';
import { zip } from 'lodash';
import { runAllSettled, validateMaybeResults } from '@tymlez/common-libs';
import { logger, FIRST_CARBON_EMISSION_TIMESTAMP } from '@tymlez/backend-libs';
import { addMilliseconds } from 'date-fns';
import type { IIsoDate } from '@tymlez/platform-api-interfaces';
import type {
  IAboutToTimeout,
  IBootstrapWithSecrets,
} from '@tymlez/backend-libs';
import { getEnergyAndCarbonRowsInDbStream } from './getEnergyAndCarbonRowsStream';
import { CET_POLICY_TAG, ENERGY_DURATION } from './constants';
import { ingestCetsToGuardian } from './ingestCetsToGuardian';
import { getLatestProcessedMrvs } from '../guardian';
import type { IProcessedMrv } from '../guardian/IProcessedMrv';

export async function loadAndIngestCetsToGuardian({
  requestId,
  bootstrap,
  aboutToTimeout,
}: {
  requestId: string;
  bootstrap: IBootstrapWithSecrets;
  aboutToTimeout: IAboutToTimeout | undefined;
}) {
  const mainMeters = Object.values(bootstrap.site_details)
    .map((siteDetail) => {
      return Object.values(siteDetail.meter_details)
        .filter((meterDetail) => meterDetail.isMain)
        .map((meterDetail) => ({
          ...meterDetail,
          region: siteDetail.region,
        }));
    })
    .flat();

  const latestMrvs = await getLatestProcessedMrvs({
    policyTag: CET_POLICY_TAG,
    deviceIds: mainMeters.map((meter) => meter.meter_id),
  });

  logger.info(
    {
      mainMeters: mainMeters.map((meter) => ({
        meter_id: meter.meter_id,
        region: meter.region,
        firstMeterEnergyTimestamp: meter.firstMeterEnergyTimestamp,
      })),
      latestMrvs,
    },
    'Inputs to getEnergyAndCarbonRowsInDbStream',
  );

  const results = await runAllSettled(
    zip(mainMeters, latestMrvs),
    async ([mainMeter, latestMrv]) => {
      assert(mainMeter, `mainMeter is missing`);
      if (latestMrv instanceof Error) {
        return latestMrv;
      }

      const fromTimestamp = getFromTimestamp({
        latestMrv,
        firstMeterEnergyTimestamp: mainMeter.firstMeterEnergyTimestamp,
      });
      assert(fromTimestamp, `fromTimestamp is missing`);

      const nextEnergyAndCarbonRowsInDb =
        await getEnergyAndCarbonRowsInDbStream({
          meter: mainMeter,
          fromTimestamp,
        });

      let result: Awaited<ReturnType<typeof nextEnergyAndCarbonRowsInDb>>;

      do {
        if (aboutToTimeout && aboutToTimeout()) {
          logger.info(
            'Skip getting next energy and carbon in DB because about to timeout',
          );
          break;
        }

        result = await nextEnergyAndCarbonRowsInDb();

        await ingestCetsToGuardian({
          requestId,
          energyAndCarbonRows: result.rows,
          aboutToTimeout,
        });
      } while (result.hasMoreData);

      return undefined;
    },
  );

  validateMaybeResults({
    message: 'Failed to ingest CETs to guardian',
    inputs: mainMeters.map((meter) => meter.meter_id),
    results,
  });
}

function getFromTimestamp({
  firstMeterEnergyTimestamp,
  latestMrv,
}: {
  latestMrv: IProcessedMrv | undefined;
  firstMeterEnergyTimestamp: IIsoDate | undefined;
}): Date | undefined {
  if (latestMrv?.timestamp) {
    // Advance by ENERGY_DURATION because fromTimestamp is inclusive
    return addMilliseconds(new Date(latestMrv.timestamp), ENERGY_DURATION);
  }

  if (
    firstMeterEnergyTimestamp &&
    new Date(firstMeterEnergyTimestamp).getTime() <
      FIRST_CARBON_EMISSION_TIMESTAMP.getTime()
  ) {
    return FIRST_CARBON_EMISSION_TIMESTAMP;
  }

  if (firstMeterEnergyTimestamp) {
    return new Date(firstMeterEnergyTimestamp);
  }

  return undefined;
}
