import { addMinutes } from 'date-fns';
import { range, reduce } from 'lodash';
import assert from 'assert';
import type { ISolarForecastDbRow } from './ISolarForecastDbRow';

export function toFiveMinutesSolarForecastRows({
  thirtyMinutesSolarForecastRows,
}: {
  thirtyMinutesSolarForecastRows: ISolarForecastDbRow[];
}) {
  return reduce(
    thirtyMinutesSolarForecastRows,
    (acc, row) => {
      assert(
        row.period === 'PT30M',
        `Solar forecast period is ${row.period}, expect PT30M`,
      );
      range(0, 6).forEach((i) => {
        acc.push({
          ...row,
          period_end: addMinutes(row.period_end, i * 5),
          pv_estimate: row.pv_estimate / 6,
          pv_estimate10: row.pv_estimate10 / 6,
          pv_estimate90: row.pv_estimate90 / 6,
          period: 'PT05M',
        });
      });
      return acc;
    },
    [] as ISolarForecastDbRow[],
  );
}
