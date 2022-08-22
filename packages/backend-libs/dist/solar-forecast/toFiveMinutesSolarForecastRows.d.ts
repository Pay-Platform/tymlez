import type { ISolarForecastDbRow } from './ISolarForecastDbRow';
export declare function toFiveMinutesSolarForecastRows({ thirtyMinutesSolarForecastRows, }: {
    thirtyMinutesSolarForecastRows: ISolarForecastDbRow[];
}): ISolarForecastDbRow[];
