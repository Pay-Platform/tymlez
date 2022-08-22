import type {
  IMeterData,
  ITimestampMsec,
  MeterId,
} from '@tymlez/platform-api-interfaces';

export interface IMeterDataProvider {
  getHistory(meterIds: MeterId[], from: Date, to: Date): Promise<IMeterData>;

  getRealtime(
    meterIds: MeterId[],
    limit: number,
    since?: ITimestampMsec,
  ): Promise<IMeterData>;
}
