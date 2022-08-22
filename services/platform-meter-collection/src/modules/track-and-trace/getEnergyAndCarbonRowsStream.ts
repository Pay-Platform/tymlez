import {
  getLastMeterEnergyTimestampInDb,
  IMeterEnergyDbRow,
  logger,
  useMeterDbPool,
  makeHasKnownErrorInMeterOrCarbon,
  validateDurationBetweenTimestamps,
} from '@tymlez/backend-libs';
import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';
import type { AustralianRegion } from '@tymlez/common-libs';
import { addDays, subHours, subMilliseconds } from 'date-fns';
import { last } from 'lodash';
import { ENERGY_DURATION } from './constants';

export async function getEnergyAndCarbonRowsInDbStream({
  meter,
  fromTimestamp: fromTimestampInput,
  disableValidation,
}: {
  meter: { meter_id: string; region: AustralianRegion };
  // Inclusive
  fromTimestamp: Date;
  disableValidation?: boolean;
}) {
  let fromTimestamp = fromTimestampInput;
  let cachedRow = {
    timestamp: subMilliseconds(fromTimestamp, ENERGY_DURATION),
    meter_id: meter.meter_id,
    regionid: meter.region,
  };

  const lastMeterEnergyTimestampInDb = await getLastMeterEnergyTimestampInDb({
    meterId: meter.meter_id,
  });

  return async function next(): Promise<{
    rows: (IMeterEnergyDbRow & ICarbonEmissionDbRow)[];
    hasMoreData: boolean;
  }> {
    let toTimestamp = addDays(fromTimestamp, 3);
    const limitDate = subHours(new Date(), 1);
    if (toTimestamp >= limitDate) {
      toTimestamp = limitDate;
    }

    if (toTimestamp.getTime() - fromTimestamp.getTime() < ENERGY_DURATION) {
      return {
        rows: [],
        hasMoreData: false,
      };
    }

    logger.info(
      {
        meter_id: meter.meter_id,
        region: meter.region,
        fromTimestamp,
        toTimestamp,
      },
      'nextEnergyAndCarbonRowsInDb inputs',
    );

    const energyAndCarbonRows = await useMeterDbPool(async (pool) => {
      const { rows } = (await pool.query(
        `
          select * from meter_energy 
          inner join 'carbon_emissions' 
          on meter_energy.timestamp = carbon_emissions.settlement_date 
          where meter_id = $1 
            and regionid = $2
            and timestamp >= $3
            and timestamp < $4
          order by timestamp;
        `,
        [
          meter.meter_id,
          meter.region,
          fromTimestamp.toISOString(),
          toTimestamp.toISOString(),
        ],
      )) as { rows: (IMeterEnergyDbRow & ICarbonEmissionDbRow)[] };

      return rows;
    });

    if (!disableValidation) {
      validateDurationBetweenTimestamps({
        id: meter.meter_id,
        ascItems: [
          ...(cachedRow ? [cachedRow] : []),
          ...energyAndCarbonRows,
        ].map((row) => ({
          timestamp: row.timestamp,
          meterId: row.meter_id,
          region: row.regionid,
        })),
        expectedDuration: ENERGY_DURATION,
        hasKnownError: makeHasKnownErrorInMeterOrCarbon(),
      });
    }

    fromTimestamp = toTimestamp;
    if (energyAndCarbonRows.length > 0) {
      cachedRow = last(energyAndCarbonRows)!;
    }

    const result = {
      rows: energyAndCarbonRows,
      hasMoreData:
        toTimestamp.getTime() <= lastMeterEnergyTimestampInDb.getTime(),
    };

    logger.info(
      {
        hasMoreData: result.hasMoreData,
        rowsLength: result.rows.length,
      },
      'nextEnergyAndCarbonRowsInDb returns',
    );

    return result;
  };
}
