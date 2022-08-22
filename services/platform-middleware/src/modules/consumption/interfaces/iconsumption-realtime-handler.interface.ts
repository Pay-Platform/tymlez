import type {
  ITimestampMsec,
  IConsumptionRealtimeRecord,
} from '@tymlez/platform-api-interfaces';

export interface IConsumptionRealtimeHandler {
  realtime(
    siteName: string,
    since: ITimestampMsec,
    getFromCache: boolean,
  ): Promise<IConsumptionRealtimeRecord[]>;
}
