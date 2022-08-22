import assert from 'assert';
import { zip } from 'lodash';
import { runAll } from '@tymlez/common-libs';
import { useMeterDbPool, logger } from '@tymlez/backend-libs';
import type { IInsertSolarForecastInput } from '@tymlez/backend-libs';

export async function getNonExistingForecasts(
  forecasts: IInsertSolarForecastInput[],
): Promise<IInsertSolarForecastInput[]> {
  return await useMeterDbPool(async (pool) => {
    const forecastExistList = await runAll(
      forecasts,
      async (forecast) => {
        const { rows: existingForecasts } = await pool.query(
          `select * from solar_forecast where resource_id = $1 and forecasted_on = $2`,
          [forecast.resource_id, forecast.forecasted_on],
        );

        if (existingForecasts.length > 0) {
          logger.info(
            {
              resource_id: forecast.resource_id,
              forecasted_on: forecast.forecasted_on,
              period_end: forecast.period_end,
            },
            'Skip forecast that already exists',
          );
        }

        return existingForecasts.length > 0;
      },
      2,
    );

    return zip(forecasts, forecastExistList)
      .filter(([_forecast, forecastExist]) => !forecastExist)
      .map(([forecast]) => {
        assert(forecast, `forecast is missing`);
        return forecast;
      });
  });
}
