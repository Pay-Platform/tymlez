import type {
  ITimestampMsec,
  IConsumptionHistoryRecord,
} from '@tymlez/platform-api-interfaces';

export interface IConsumptionHistoryHandler {
  history(
    siteName: string,
    from: ITimestampMsec,
    to: ITimestampMsec,
  ): Promise<Array<IConsumptionHistoryRecord>>;
}
