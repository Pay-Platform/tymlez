import type { IMeterEnergyDbRow, IAboutToTimeout } from '@tymlez/backend-libs';
import {
  calcCarbonFromKWh,
  ICarbonEmissionDbRow,
  logger,
} from '@tymlez/backend-libs';
import type { kWh } from '@tymlez/platform-api-interfaces';
import { CET_POLICY_TAG } from './constants';
import {
  generateMrv,
  IGenerateMrvRequest,
} from '../../modules/guardian/generateMrv';

export async function ingestCetsToGuardian({
  requestId,
  energyAndCarbonRows,
  aboutToTimeout,
}: {
  requestId: string;
  energyAndCarbonRows: (IMeterEnergyDbRow & ICarbonEmissionDbRow)[];
  aboutToTimeout: IAboutToTimeout | undefined;
}) {
  logger.info(`Ingesting ${energyAndCarbonRows.length} CET rows to Guardian`);

  const requests = energyAndCarbonRows.map((energyAndCarbonRow) => {
    const mrvEnergyAmount: kWh =
      energyAndCarbonRow.eRealKwh_0 +
      energyAndCarbonRow.eRealKwh_1 +
      energyAndCarbonRow.eRealKwh_2 +
      energyAndCarbonRow.eRealKwh_3 +
      energyAndCarbonRow.eRealKwh_4 +
      energyAndCarbonRow.eRealKwh_5;

    const mrvCarbonAmount = calcCarbonFromKWh({
      energyKWh: mrvEnergyAmount,
      factor: energyAndCarbonRow.factor,
    });

    const request: IGenerateMrvRequest = {
      requestId,
      deviceId: energyAndCarbonRow.meter_id,
      policyTag: CET_POLICY_TAG,
      setting: {
        mrvTimestamp: energyAndCarbonRow.timestamp.toISOString(),
        mrvDuration: energyAndCarbonRow.duration,
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
        'Skip ingesting CET to Guardian because about to timeout',
      );
      break;
    }
    await generateMrv({
      request,
    });
  }
}
