import { chunk } from 'lodash';
import { useMeterDbPool, logger } from '@tymlez/backend-libs';
import type { IInsertSolarForecastInput } from '@tymlez/backend-libs';

export async function insertSolarForecasts({
  forecasts: allForecasts,
}: {
  forecasts: IInsertSolarForecastInput[];
}): Promise<void> {
  return useMeterDbPool(async (pool) => {
    const forecastsChunks = chunk(allForecasts, 10);

    for (
      let chunkIndex = 0;
      chunkIndex < forecastsChunks.length;
      ++chunkIndex
    ) {
      const forecasts = forecastsChunks[chunkIndex];

      for (const forecast of forecasts) {
        logger.info({ forecast }, 'Ingesting solar forecast');

        const values = [
          forecast.resource_id,
          forecast.forecasted_on,
          forecast.period,
          forecast.period_end,
          forecast.pv_estimate,
          forecast.pv_estimate10,
          forecast.pv_estimate90,
          forecast.requestId,
        ];

        const text = `INSERT INTO solar_forecast(
          resource_id,
          forecasted_on,
          period,
          period_end,
          pv_estimate,
          pv_estimate10,
          pv_estimate90,
          requestId,
          createdAt
        ) VALUES (${values.map((_value, i) => `$${i + 1}`)}, now())`;

        await pool.query({
          name: `insert-solar-forecasts`,
          text,
          values,
        });
      }

      await pool.query('COMMIT');
    }
  });
}
