import assert from 'assert';
import { zip } from 'lodash';
import {
  runAllSettled,
  validateMaybeResults,
  truncToMinutes,
} from '@tymlez/common-libs';
import {
  logger,
  FIRST_CARBON_EMISSION_TIMESTAMP,
  getFirstSolarForecastTimestampInDb,
} from '@tymlez/backend-libs';
import type {
  IAboutToTimeout,
  IBootstrapWithSecrets,
} from '@tymlez/backend-libs';
import { addMilliseconds } from 'date-fns';
import { CARBON_EMISSION_DURATION, CRUF_POLICY_TAG } from './constants';
import { getLatestProcessedMrvs } from '../guardian';
import { getSolarForecastAndCarbonRowsInDbStream } from './getSolarForecastAndCarbonRowsStream';
import type { IProcessedMrv } from '../guardian/IProcessedMrv';
import { ingestCrufsToGuardian } from './ingestCrufsToGuardian';

export async function loadAndIngestCrufsToGuardian({
  requestId,
  bootstrap,
  aboutToTimeout,
}: {
  requestId: string;
  bootstrap: IBootstrapWithSecrets;
  aboutToTimeout: IAboutToTimeout | undefined;
}) {
  const solarResources = Object.values(bootstrap.site_details)
    .map((siteDetail) => {
      assert(
        siteDetail.solcast_resource_id,
        `For ${siteDetail.name}: solcast_resource_id is missing`,
      );
      return {
        resourceId: siteDetail.solcast_resource_id,
        region: siteDetail.region,
      };
    })
    .flat();

  const latestMrvs = await getLatestProcessedMrvs({
    policyTag: CRUF_POLICY_TAG,
    deviceIds: solarResources.map((solarResource) => solarResource.resourceId),
  });

  logger.info(
    {
      solarResources,
      latestMrvs,
    },
    'Inputs to getSolarForecastAndCarbonRowsInDbStream',
  );

  const results = await runAllSettled(
    zip(solarResources, latestMrvs),
    async ([solarResource, latestMrv]) => {
      assert(solarResource, `solarResource is missing`);
      if (latestMrv instanceof Error) {
        return latestMrv;
      }

      const fromTimestamp = await getFromTimestamp({
        latestMrv,
        resourceId: solarResource.resourceId,
      });
      assert(fromTimestamp, `fromTimestamp is missing`);
      const truncatedFromTimestamp = truncToMinutes(fromTimestamp, 30);

      const nextSolarForecastAndCarbonRowsInDb =
        await getSolarForecastAndCarbonRowsInDbStream({
          solarResource,
          fromTimestamp: truncatedFromTimestamp,
        });

      let result: Awaited<
        ReturnType<typeof nextSolarForecastAndCarbonRowsInDb>
      >;

      do {
        if (aboutToTimeout && aboutToTimeout()) {
          logger.info(
            'Skip getting next solar forecast and carbon in DB because about to timeout',
          );
          break;
        }

        result = await nextSolarForecastAndCarbonRowsInDb();

        await ingestCrufsToGuardian({
          requestId,
          solarForecastAndCarbonRows: result.rows,
          aboutToTimeout,
        });
      } while (result.hasMoreData);

      return undefined;
    },
  );

  validateMaybeResults({
    message: 'Failed to ingest CRUFs to guardian',
    inputs: solarResources,
    results,
  });
}

async function getFromTimestamp({
  latestMrv,
  resourceId,
}: {
  latestMrv: IProcessedMrv | undefined;
  resourceId: string;
}): Promise<Date | undefined> {
  if (latestMrv?.timestamp) {
    // Advance by CARBON_EMISSION_DURATION because fromTimestamp is inclusive
    return addMilliseconds(
      new Date(latestMrv.timestamp),
      CARBON_EMISSION_DURATION,
    );
  }

  const firstSolarForecastTimestamp = await getFirstSolarForecastTimestampInDb({
    resourceId,
  });

  if (
    firstSolarForecastTimestamp.getTime() <
    FIRST_CARBON_EMISSION_TIMESTAMP.getTime()
  ) {
    return FIRST_CARBON_EMISSION_TIMESTAMP;
  }

  return firstSolarForecastTimestamp;
}
