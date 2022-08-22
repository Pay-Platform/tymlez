import {
  ITimestampMsec,
  kWh,
  ITimeSpanMsec,
  UUID,
} from '@tymlez/platform-api-interfaces';

export interface ICohortForecastGenerationRecord {
  resourceId?: UUID;
  periodEnd: ITimestampMsec;
  estimated: kWh;
  period: ITimeSpanMsec;
}
