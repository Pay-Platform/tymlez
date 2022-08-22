import { logger } from '@tymlez/backend-libs';
import type { ClientBase } from 'pg';
import type { IConfig } from '../../tools/lib/getBuildTimeConfig';
import INITIAL_DATA from './solcast.json';

export async function up(client: ClientBase, config: IConfig): Promise<void> {
  const solcastResourceIds = (
    config.BOOTSTRAP_DATA
      ? Object.values(config.BOOTSTRAP_DATA.site_details).map((siteDetail) => {
          return siteDetail.solcast_resource_id;
        })
      : ['']
  ) as string[];

  logger.debug(solcastResourceIds);

  const queries = await prepareforecastDataInstertQueries(
    client,
    solcastResourceIds,
  );

  await Promise.all(queries);
  await client.query('COMMIT');
}

async function prepareforecastDataInstertQueries(
  client: ClientBase,
  solcastResourceIds: Array<string>,
) {
  const createdAt = new Date();

  const queries = [];

  for (const resourceId of solcastResourceIds) {
    for (
      let initialDataIndex = 0;
      initialDataIndex < INITIAL_DATA.length;
      initialDataIndex++
    ) {
      const timepoints = INITIAL_DATA[initialDataIndex].forecasts.map(
        (item) => item.period_end.split('T')[1],
      );
      const jsonDaysToNow = new Map<string, string>();
      const days = INITIAL_DATA[initialDataIndex].forecasts.map(
        (item) => item.period_end.split('T')[0],
      );
      days
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((day, ind) =>
          jsonDaysToNow.set(
            day.split('T')[0],
            new Date(Date.now() + (ind + 3) * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          ),
        );

      for (
        let forecastRecordIndex = 0;
        forecastRecordIndex < INITIAL_DATA[initialDataIndex].forecasts.length;
        forecastRecordIndex++
      ) {
        queries.push(
          await prepareforecastDataInstertQuery(
            client,
            initialDataIndex,
            forecastRecordIndex,
            createdAt,
            resourceId,
            timepoints[forecastRecordIndex],
            jsonDaysToNow.get(days[forecastRecordIndex]) || 'today',
          ),
        );
      }
    }
  }

  return queries;
}

async function prepareforecastDataInstertQuery(
  client: ClientBase,
  dataSetIndex: number,
  timepointIndex: number,
  createdAt: Date,
  resourceId: string,
  time: string,
  day: string,
) {
  const text = `INSERT INTO solar_forecast VALUES(${Array.from(
    Array(9).keys(),
    (_v, k) => `$${k + 1}`,
  ).join(', ')});`;

  const row = INITIAL_DATA[dataSetIndex].forecasts[timepointIndex];
  const values = [
    resourceId !== ''
      ? resourceId
      : INITIAL_DATA[dataSetIndex].solcast_resource_id,
    `${day}T${time}`,
    row.period,
    row.pv_estimate,
    row.pv_estimate10,
    row.pv_estimate90,
    createdAt.toISOString(),
    `local_seeder_generated_forecast_data`,
    createdAt.toISOString(),
  ];
  return client.query({
    name: 'insert solar forecast data new schema',
    text,
    values,
  });
}
