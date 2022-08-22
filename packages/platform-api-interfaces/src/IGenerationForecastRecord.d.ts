import { ITimestampMsec } from './ITimestampMsec';
import { kWh } from './kWh';
import type { ITimeSpanMsec, UUID } from '..';

export type IGenerationForecastRecord = {
  resourceId?: UUID;
  periodEnd: ITimestampMsec;
  estimated: kWh;
  period: ITimeSpanMsec;
};
