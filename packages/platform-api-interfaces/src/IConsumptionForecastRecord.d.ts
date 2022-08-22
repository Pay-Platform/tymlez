import { ITimestampMsec } from './ITimestampMsec';
import { IOrigin } from './IOrigin';
import { kWh } from './kWh';
import { ISourceCategory } from './ISourceCategory';

export type IConsumptionForecastRecord = {
  timestamp: ITimestampMsec;
  value: kWh;
  consumerType: string;
  meterId: string;
  sourceType: string;
  origin: IOrigin;
  sourceCategory: ISourceCategory;
};
