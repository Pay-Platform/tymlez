import type {
  IInsertSolarForecastInput,
  ISolcastUtilityScaleForecastResponse,
} from '@tymlez/backend-libs';
import { logger } from '@tymlez/backend-libs';
import { getNonExistingForecasts } from './getNonExistingForecasts';
import { insertSolarForecasts } from './insertSolarForecasts';

export async function ingestSolarForecasts({
  requestId,
  forecastResponses,
}: {
  requestId: string;
  forecastResponses: ISolcastUtilityScaleForecastResponse[];
}): Promise<void> {
  const forecastInputs: IInsertSolarForecastInput[] = forecastResponses
    .map((forecastResponse) =>
      forecastResponse.forecasts.map((forecast) => ({
        resource_id: forecastResponse.solcast_resource_id,
        forecasted_on: forecastResponse.forecasted_on,
        period: forecast.period,
        period_end: forecast.period_end,
        pv_estimate: forecast.pv_estimate,
        pv_estimate10: forecast.pv_estimate10,
        pv_estimate90: forecast.pv_estimate90,
        requestId,
      })),
    )
    .flat();

  logger.info(
    `Ingesting ${forecastInputs.length} forecasts from ${forecastResponses.length} forecast responses`,
  );

  const nonExistingForecasts = await getNonExistingForecasts(forecastInputs);

  await insertSolarForecasts({
    forecasts: nonExistingForecasts,
  });
}
