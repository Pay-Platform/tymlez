import { ITimestampMsec } from '../../ITimestampMsec';
import { UUID } from '../../UUID';
import { ITimeSeries } from '../series';

export interface IDashboard {
  sitesNum: number;
  stored: number;
  generated24: number;
  consumed24: number;
  sites: IDashboardSite[];
  overview24: IOverview24;
  topConsumers: Array<IConsumerSummary>;
  sitesAssets: Array<ISiteAsset>;
}

export interface IDashboardSite {
  siteId: UUID;
  title: string;
  address: string;
  lat: number;
  lng: number;

  consumption?: number;
  generation?: number;
  status?: SiteStatus;
  assets?: Array<ISiteAsset>;
}

export type SiteStatus = 'online' | 'offline';

export interface IOverview24 {
  series: Array<ITimeSeries>;
}

export interface IConsumerSummary {
  type: string;
  amount: number;
  greenPercentage: number;
}

export interface ISiteAsset {
  siteId: UUID;
  title: string;
  value: number;
}

export interface IConsumptionHistory {
  siteId: UUID;
  timestamp: Date;
  value: number;
  consumerType: string;
  sourceType: string;
  origin: string;
  consumerId: string;
}

export interface IConsumerRealtimeRecord {
  value: number;
  duration: number;
  timestamp: Date;
  consumer: ISiteAsset;
}

export interface IGeneratorRealtimeRecord {
  value: number;
  duration: number;
  timestamp: Date;
  generator: ISiteAsset;
}

export interface IConsumptionRealtimeRecord {
  siteId: UUID;
  timestamp: ITimestampMsec;
  value: number;
  consumerType: string;
  consumerId: string;
  sourceType: string;
  origin: string;
  sourceCategory: string;
}

export interface ISiteGenerationHistory {
  series: Array<ITimeSeries>;
}

export interface IGECompliance {
  purchased: number;
  generated: number;
  fossil: number;
}

export interface ITopConsumer {
  amount: number;
  green: number;
  type: string;
}
