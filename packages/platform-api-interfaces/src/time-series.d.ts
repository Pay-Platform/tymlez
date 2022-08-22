import { ITimestampMsec, kWh } from '@tymlez/platform-api-interfaces';

export interface IEnergyTimeSeriesPoint {
  timestamp: ITimestampMsec;
  value: kWh;
}

export interface IEnergyTimeSeries {
  name: string;
  data: Array<IEnergyTimeSeriesPoint>;
}
