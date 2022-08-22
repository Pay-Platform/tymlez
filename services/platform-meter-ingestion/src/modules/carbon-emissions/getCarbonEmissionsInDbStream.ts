import type { ICarbonEmissionDbRow } from '@tymlez/backend-libs';
import { addDays, subMilliseconds } from 'date-fns';
import { first, groupBy, last, uniqBy } from 'lodash';
import {
  KNOWN_CARBON_EMISSION_ERRORS_MAP,
  validateDurationBetweenTimestamps,
  useMeterDbPool,
  logger,
} from '@tymlez/backend-libs';
import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import { getFirstSettlementDateInDb } from './getFirstSettlementDateInDb';
import { getLastSettlementDateInDb } from './getLastSettlementDateInDb';

const CARBON_EMISSION_DURATION: ITimeSpanMsec = 300_000;

export async function getCarbonEmissionsInDbStream({
  disableValidation,
}: {
  disableValidation?: boolean;
} = {}) {
  const firstSettlementDate = await getFirstSettlementDateInDb();
  const lastSettlementDate = await getLastSettlementDateInDb();

  let fromDate = firstSettlementDate;
  let cachedCarbonEmission: { settlement_date: Date } = {
    settlement_date: subMilliseconds(
      firstSettlementDate,
      CARBON_EMISSION_DURATION,
    ),
  };

  return async function next(): Promise<{
    carbonEmissions: ICarbonEmissionDbRow[];
    hasMoreData: boolean;
  }> {
    const toDate = addDays(fromDate, 3);

    logger.info(
      {
        firstSettlementDate,
        lastSettlementDate,
        fromDate,
        toDate,
      },
      'nextCarbonEmissionsInDb',
    );

    const rawCarbonEmissions = await useMeterDbPool(async (pool) => {
      const { rows } = await pool.query(
        `
          select * from carbon_emissions
          where settlement_date >= $1 
            and settlement_date < $2
          order by settlement_date;
        `,
        [fromDate, toDate],
      );

      return rows as ICarbonEmissionDbRow[];
    });

    const carbonEmissions = uniqBy(
      rawCarbonEmissions,
      (i) => `${i.regionid}@${i.settlement_date}`,
    );

    logger.info('Number of carbonEmissions', carbonEmissions.length);

    if (!disableValidation) {
      const carbonEmissionsMap = groupBy(
        carbonEmissions,
        (emission) => emission.regionid,
      );

      Object.entries(carbonEmissionsMap).forEach(([key, values]) => {
        logger.info(
          `For ${key}: Validating ${values.length} carbon emissions between ` +
            `${first(values)?.settlement_date.toISOString()} and ` +
            `${last(values)?.settlement_date.toISOString()}`,
        );
        validateDurationBetweenTimestamps({
          id: key,
          ascItems: [
            ...(cachedCarbonEmission ? [cachedCarbonEmission] : []),
            ...values,
          ].map((value) => ({
            timestamp: new Date(value.settlement_date),
          })),
          expectedDuration: CARBON_EMISSION_DURATION,
          knownErrorsMap: KNOWN_CARBON_EMISSION_ERRORS_MAP,
        });
      });
    }

    fromDate = toDate;
    if (carbonEmissions.length > 0) {
      cachedCarbonEmission = last(carbonEmissions)!;
    }

    return {
      carbonEmissions,
      hasMoreData: toDate <= lastSettlementDate,
    };
  };
}
