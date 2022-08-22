import type { ISolarForecastDbRow } from './ISolarForecastDbRow';
import { useMeterDbPool } from '../meter-db';

export async function getSolarForecastDbRows({
  resourceId,
  fromTimestamp,
  toTimestamp,
}: {
  resourceId: string;
  fromTimestamp: Date;
  toTimestamp: Date;
}) {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (await pool.query(
      `
        select cast( period_end as timestamp) period_end, * 
        from solar_forecast 
        latest by resource_id, period_end
        where resource_id = $1
          and period_end >= $2
          and period_end < $3
        order by period_end;
      `,
      [
        resourceId, //
        fromTimestamp.toISOString(),
        toTimestamp.toISOString(),
      ],
    )) as { rows: ISolarForecastDbRow[] };

    return rows;
  });
}
