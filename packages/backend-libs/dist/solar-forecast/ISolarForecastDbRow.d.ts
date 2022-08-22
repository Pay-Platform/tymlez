import type { kWh } from '@tymlez/platform-api-interfaces';
export interface ISolarForecastDbRow {
    resource_id: string;
    forecasted_on: Date;
    period_end: Date;
    period: string;
    pv_estimate: kWh;
    pv_estimate10: kWh;
    pv_estimate90: kWh;
    requestId: string;
}
