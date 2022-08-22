import { keyBy, reduce } from 'lodash';
import { hasDuplicates } from '@tymlez/common-libs';
import assert from 'assert';
import type { ISolarForecastDbRow } from '../solar-forecast';
import type { ICarbonEmissionDbRow } from '../carbon-emission';

export function joinSolarForecastAndCarbonRows({
  carbonRows,
  solarForecastRows,
}: {
  carbonRows: ICarbonEmissionDbRow[];
  solarForecastRows: ISolarForecastDbRow[];
}) {
  assert(
    !hasDuplicates(carbonRows, (row) => row.settlement_date.toISOString()),
    `carbonRows have duplicated settlement_date`,
  );
  assert(
    !hasDuplicates(solarForecastRows, (row) => row.period_end.toISOString()),
    `solarForecastRows have duplicated period_end`,
  );

  const carbonRowsMap = keyBy(carbonRows, (row) =>
    row.settlement_date.toISOString(),
  );

  const solarForecastAndCarbonRows = reduce(
    solarForecastRows,
    (acc, solarForecastRow) => {
      const carbonRow: ICarbonEmissionDbRow | undefined =
        carbonRowsMap[solarForecastRow.period_end.toISOString()];
      if (carbonRow) {
        acc.push({
          ...solarForecastRow,
          ...carbonRow,
        });
      }

      return acc;
    },
    [] as (ISolarForecastDbRow & ICarbonEmissionDbRow)[],
  );
  return solarForecastAndCarbonRows;
}
