import { IMetricTon } from './IMetricTon';

export type ISiteEmissionSum = {
  produced: IMetricTon;
  saved: IMetricTon;
};

export type ISiteEmissionTotal = {
  last30d: ISiteEmissionSum;
  last24h: ISiteEmissionSum;
};
