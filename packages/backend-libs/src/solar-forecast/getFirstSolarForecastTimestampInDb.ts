import assert from 'assert';
import { useMeterDbPool } from '../meter-db';

export async function getFirstSolarForecastTimestampInDb({
  resourceId,
}: {
  resourceId?: string;
} = {}): Promise<Date> {
  return await useMeterDbPool(async (pool) => {
    const { rows } = (
      resourceId
        ? await pool.query(
            `
              select cast( period_end as timestamp) period_end, * 
              from solar_forecast
              latest by resource_id, period_end
              where resource_id = $1
              order by period_end asc
              limit 1
            `,
            [resourceId],
          )
        : await pool.query(
            `
              select cast( period_end as timestamp) period_end, * 
              from solar_forecast
              latest by resource_id, period_end
              order by period_end asc
              limit 1
            `,
          )
    ) as { rows: { period_end: Date }[] };

    assert(
      rows.length === 1,
      `Number of first solar forecasts is ${rows.length}, expect 1`,
    );

    return rows[0].period_end;
  });
}
