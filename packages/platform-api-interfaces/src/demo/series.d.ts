import { ITimestampSec } from '../ITimestampSec';

export interface ITimeSeriesPoint {
  timestamp: ITimestampSec;
  value: number;
}
export interface ITimeSeries {
  name: string;
  data: Array<ITimeSeriesPoint>;
}
