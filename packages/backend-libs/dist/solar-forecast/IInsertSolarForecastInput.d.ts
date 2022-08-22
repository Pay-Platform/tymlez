import type { IIsoDate, kWh } from '@tymlez/platform-api-interfaces';
export declare type IInsertSolarForecastInput = {
    resource_id: string;
    forecasted_on: IIsoDate;
    period_end: IIsoDate;
    period: string;
    pv_estimate: kWh;
    pv_estimate10: kWh;
    pv_estimate90: kWh;
    requestId: string;
};
