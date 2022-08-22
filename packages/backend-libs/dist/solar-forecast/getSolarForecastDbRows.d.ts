import type { ISolarForecastDbRow } from './ISolarForecastDbRow';
export declare function getSolarForecastDbRows({ resourceId, fromTimestamp, toTimestamp, }: {
    resourceId: string;
    fromTimestamp: Date;
    toTimestamp: Date;
}): Promise<ISolarForecastDbRow[]>;
