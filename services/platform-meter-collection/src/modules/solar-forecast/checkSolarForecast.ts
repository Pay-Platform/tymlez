import type { IBootstrap } from '@tymlez/backend-libs';
import {
  runAll,
  runAllSettled,
  validateMaybeResults,
} from '@tymlez/common-libs';
import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import assert from 'assert';
import { isSameDay, startOfDay } from 'date-fns';
import { first, reduce } from 'lodash';
import {
  KNOWN_WATTWATCHERS_ERRORS_MAP,
  validateDurationBetweenTimestamps,
  useMeterDbPool,
  logger,
} from '@tymlez/backend-libs';
// 30 minutes
const SOLAR_FORECAST_DURATION: ITimeSpanMsec = 30 * 60 * 1000;

export async function checkSolarForecast(
  bootstrap: Pick<IBootstrap, 'site_details'>,
) {
  const forecastItemsMap = await getForecastItemsMap();

  const solcastDetails = Object.values(bootstrap.site_details).map(
    (siteDetail) => ({
      siteName: siteDetail.name,
      solcast_resource_id: siteDetail.solcast_resource_id,
    }),
  );

  const results = await runAllSettled(solcastDetails, async (solcastDetail) => {
    if (!solcastDetail.solcast_resource_id) {
      logger.warn(
        `Skip for site ${solcastDetail.siteName}, which has no solcast_resource_id`,
      );
      return;
    }

    const forecastItems = forecastItemsMap[solcastDetail.solcast_resource_id];

    if (!forecastItems || forecastItems.length <= 0) {
      throw new Error(`Missing data for ${solcastDetail.solcast_resource_id}`);
    }

    const startOfToday = startOfDay(new Date());
    const firstForecastTimestamp = first(forecastItems)!.period_end;
    assert(
      isSameDay(firstForecastTimestamp, startOfToday),
      `For ${
        solcastDetail.solcast_resource_id
      }: first forecast is from ${firstForecastTimestamp.toISOString()} ` +
        `expect to be for today: ${startOfToday.toISOString()}.`,
    );

    validateDurationBetweenTimestamps({
      id: solcastDetail.solcast_resource_id,
      ascItems: forecastItems.map((item) => ({
        timestamp: item.period_end,
      })),
      expectedDuration: SOLAR_FORECAST_DURATION,
      knownErrorsMap: KNOWN_WATTWATCHERS_ERRORS_MAP,
    });
  });

  validateMaybeResults({
    message: 'Solar forecast table has wrong data',
    inputs: solcastDetails.map((detail) => ({
      solcast_resource_id: detail.solcast_resource_id,
      siteName: detail.siteName,
    })),
    results,
  });
}

async function getForecastItemsMap(): Promise<
  Record<string, ISolarForecastRow[] | undefined>
> {
  return await useMeterDbPool(async (pool) => {
    const { rows: lastForecastResponses } = (await pool.query(
      `select * from 'solar_forecast' latest by resource_id;`,
    )) as { rows: ISolarForecastRow[] };

    const forecasts = (
      await runAll(
        lastForecastResponses,
        async (forecastResponse) => {
          const { rows } = (await pool.query(
            `
            select resource_id, forecasted_on, cast(period_end as TIMESTAMP) period_end from 'solar_forecast' 
            where resource_id = $1 and forecasted_on = $2 
            order by period_end;
          `,
            [forecastResponse.resource_id, forecastResponse.forecasted_on],
          )) as {
            rows: ISolarForecastRow[];
          };

          return rows;
        },
        2,
      )
    ).flat();

    return reduce(
      forecasts,
      (acc, forecast) => {
        if (!acc[forecast.resource_id]) {
          acc[forecast.resource_id] = [];
        }

        acc[forecast.resource_id]!.push(forecast);
        return acc;
      },
      {} as Record<string, ISolarForecastRow[] | undefined>,
    );
  });
}

interface ISolarForecastRow {
  resource_id: string;
  period_end: Date;
  forecasted_on: Date;
}
