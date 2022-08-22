import type { ITimestampMsec, MeterId, kWh } from '@tymlez/platform-api-interfaces';
export interface IMeterTimeSeriesPoint {
    timestamp: ITimestampMsec;
    values: kWh[];
}
export interface IMeterTimeSeries {
    meterId: MeterId;
    data: Array<IMeterTimeSeriesPoint>;
}
export interface IMeterData {
    meters: IMeterTimeSeries[];
}
export interface IMeterService {
    getHistory(meterIds: MeterId[], from: Date, to: Date): Promise<IMeterData>;
    getRealtime(meterIds: MeterId[], limit: number, since?: ITimestampMsec): Promise<IMeterData>;
}
