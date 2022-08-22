import {
  calcCarbonFromKWh,
  ICarbonEmissionDbRow,
  logger,
} from '@tymlez/backend-libs';
import type {
  IAboutToTimeout,
  ISolarForecastDbRow,
} from '@tymlez/backend-libs';
import { CARBON_EMISSION_DURATION, CRUF_POLICY_TAG } from './constants';
import {
  generateMrv,
  IGenerateMrvRequest,
} from '../../modules/guardian/generateMrv';

export async function ingestCrufsToGuardian({
  requestId,
  solarForecastAndCarbonRows,
  aboutToTimeout,
}: {
  requestId: string;
  solarForecastAndCarbonRows: (ISolarForecastDbRow & ICarbonEmissionDbRow)[];
  aboutToTimeout: IAboutToTimeout | undefined;
}) {
  logger.info(
    `Ingesting ${solarForecastAndCarbonRows.length} CRUF rows to Guardian`,
  );

  const requests = solarForecastAndCarbonRows.map((row) => {
    const mrvEnergyAmount = row.pv_estimate;
    const mrvCarbonAmount = calcCarbonFromKWh({
      energyKWh: mrvEnergyAmount,
      factor: row.factor,
    });

    const request: IGenerateMrvRequest = {
      requestId,
      deviceId: row.resource_id,
      policyTag: CRUF_POLICY_TAG,
      setting: {
        mrvTimestamp: row.period_end.toISOString(),
        mrvDuration: CARBON_EMISSION_DURATION,
        mrvEnergyAmount,
        mrvCarbonAmount,
      },
    };

    return request;
  });

  // Explicitly ingest sequentially
  for (const request of requests) {
    if (aboutToTimeout && aboutToTimeout()) {
      logger.info(
        { request },
        'Skip ingesting CRUF to Guardian because about to timeout',
      );
      break;
    }

    await generateMrv({
      request,
    });
  }
}
