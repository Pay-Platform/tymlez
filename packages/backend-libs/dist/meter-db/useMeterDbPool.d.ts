import type { Pool } from 'pg';
import { IGetMeterDbPoolOptions } from './getMeterDbPool';
export declare function useMeterDbPool<T>(callback: (pool: Pool) => Promise<T>, options?: IGetMeterDbPoolOptions): Promise<T>;
