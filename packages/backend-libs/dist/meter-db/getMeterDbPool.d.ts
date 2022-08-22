import { Pool } from 'pg';
export declare const getMeterDbPool: ({ METER_DB_DATABASE, METER_DB_HOST, METER_DB_PORT, METER_DB_USERNAME, METER_DB_PASSWORD, }?: IGetMeterDbPoolOptions) => Pool;
export interface IGetMeterDbPoolOptions {
    METER_DB_DATABASE?: string;
    METER_DB_HOST?: string;
    METER_DB_PORT?: string;
    METER_DB_USERNAME?: string;
    METER_DB_PASSWORD?: string;
}
