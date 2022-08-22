import type { IIsoDate } from '@tymlez/platform-api-interfaces';
export interface ISolcastUtilityScaleForecastResponse {
    solcast_resource_id: string;
    lat?: string | number;
    lon?: string | number;
    timezone?: string;
    timezone_offset?: number;
    forecasted_on: IIsoDate;
    forecasts: ISolcastUtilityScaleForecastItem[];
}
export interface ISolcastUtilityScaleForecastItem {
    pv_estimate: number;
    pv_estimate10: number;
    pv_estimate90: number;
    period_end: IIsoDate;
    period: SolcastForecastPeriod;
}
export declare type SolcastForecastPeriod = 'PT5M' | 'PT10M' | 'PT15M' | 'PT30M';