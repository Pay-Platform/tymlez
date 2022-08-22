import {
  getLastSolarForecastTimestampInDb,
  getSolarForecastDbRows,
  ISolarForecastDbRow,
  toFiveMinutesSolarForecastRows,
  getCarbonEmissionDbRows,
  ICarbonEmissionDbRow,
  joinSolarForecastAndCarbonRows,
  logger,
  KNOWN_CARBON_EMISSION_ERRORS_MAP,
  validateDurationBetweenTimestamps,
} from '@tymlez/backend-libs';
import type { AustralianRegion } from '@tymlez/common-libs';
import { addDays, subMilliseconds } from 'date-fns';
import { last } from 'lodash';
import { CARBON_EMISSION_DURATION } from './constants';

export async function getSolarForecastAndCarbonRowsInDbStream({
  solarResource,
  fromTimestamp: fromTimestampInput,
  toTimestamp: toTimestampInput,
  disableValidation,
}: {
  solarResource: { resourceId: string; region: AustralianRegion };
  // Inclusive
  fromTimestamp: Date;
  // Exclusive
  toTimestamp?: Date;
  disableValidation?: boolean;
}) {
  let fromTimestamp = fromTimestampInput;

  const lastSolarForecastTimestampInDb =
    await getLastSolarForecastTimestampInDb({
      resourceId: solarResource.resourceId,
    });

  const lastSolarForecastTimestamp =
    toTimestampInput &&
    toTimestampInput.getTime() < lastSolarForecastTimestampInDb.getTime()
      ? toTimestampInput
      : lastSolarForecastTimestampInDb;

  let cachedRow = {
    period_end: subMilliseconds(fromTimestamp, CARBON_EMISSION_DURATION),
    resource_id: solarResource.resourceId,
    regionid: solarResource.region,
  };

  return async function next(): Promise<{
    rows: (ISolarForecastDbRow & ICarbonEmissionDbRow)[];
    hasMoreData: boolean;
  }> {
    const toTimestamp = addDays(fromTimestamp, 3);

    logger.info(
      {
        solarResource,
        fromTimestamp,
        toTimestamp,
      },
      'nextSolarForecastAndCarbonRowsInDb inputs',
    );

    const thirtyMinutesSolarForecastRows = await getSolarForecastDbRows({
      resourceId: solarResource.resourceId,
      fromTimestamp,
      toTimestamp,
    });

    const fiveMinutesSolarForecastRows = toFiveMinutesSolarForecastRows({
      thirtyMinutesSolarForecastRows,
    });

    const carbonRows = await getCarbonEmissionDbRows({
      region: solarResource.region,
      fromTimestamp,
      toTimestamp,
    });

    const solarForecastAndCarbonRows = joinSolarForecastAndCarbonRows({
      carbonRows,
      solarForecastRows: fiveMinutesSolarForecastRows,
    });

    if (!disableValidation) {
      validateDurationBetweenTimestamps({
        id: `${solarResource.resourceId}-${solarResource.region}`,
        ascItems: [
          ...(cachedRow ? [cachedRow] : []),
          ...solarForecastAndCarbonRows,
        ].map((row) => ({
          timestamp: row.period_end,
        })),
        expectedDuration: CARBON_EMISSION_DURATION,
        knownErrorsMap: KNOWN_CARBON_EMISSION_ERRORS_MAP,
      });
    }

    fromTimestamp = toTimestamp;
    if (solarForecastAndCarbonRows.length > 0) {
      cachedRow = last(solarForecastAndCarbonRows)!;
    }

    const result = {
      rows: solarForecastAndCarbonRows,
      hasMoreData:
        toTimestamp.getTime() <= lastSolarForecastTimestamp.getTime(),
    };

    logger.info(
      {
        hasMoreData: result.hasMoreData,
        rowsLength: result.rows.length,
      },
      'nextSolarForecastAndCarbonRowsInDb returns',
    );

    return result;
  };
}
