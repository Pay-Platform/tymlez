import type { kWh, IMetricKg } from '..';
import { ITimestampMsec } from './ITimestampMsec';

export type ICarbonEmissionsRecord = {
  timestamp: ITimestampMsec;
  consumption: kWh;
  generation: kWh;
  saved: IMetricKg;
  produced: IMetricKg;
};
