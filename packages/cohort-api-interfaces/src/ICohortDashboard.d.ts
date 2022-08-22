import {
  IPercent,
  kWh,
  UUID,
  IOrigin,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';
import { ICohortSiteDetail } from './ICohortSiteDetail';

export interface ICohortDashboard {
  generated24h?: kWh;
  consumed24h?: kWh;
  sites: ICohortSiteDetail[];
  overview24h?: {
    series: {
      name: string;
      data: {
        timestamp: ITimestampMsec;
        value: kWh;
      }[];
    }[];
  };
}

export interface IConsumptionHistory {
  siteName: string;
  timestamp: ITimestampMsec;
  value: kWh;
  consumerType: string;
  sourceType: string;
  origin: string;
  consumerId: string;
}

export interface IConsumptionForecast {
  siteName: string;
  timestamp: ITimestampMsec;
  value: kWh;
  consumerId: string;
}

export interface ICohortConsumptionRecord {
  timestamp: ITimestampMsec;
  value: kWh;
}

export interface ITopConsumer {
  amount: kWh;
  green: IPercent;
  type: string;
}
