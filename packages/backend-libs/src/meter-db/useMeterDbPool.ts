import type { Pool } from 'pg';
import { getMeterDbPool, IGetMeterDbPoolOptions } from './getMeterDbPool';

export async function useMeterDbPool<T>(
  callback: (pool: Pool) => Promise<T>,
  options: IGetMeterDbPoolOptions = {},
) {
  const pool = getMeterDbPool(options);

  try {
    return await callback(pool);
  } finally {
    await pool.end();
  }
}
