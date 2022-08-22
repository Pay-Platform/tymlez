/**
 * Pure test/fake meter data provider.
 * It can be used in configuration w/o QuestDB.
 * TODO: implement periodic test data generation instead of empty set.
 */
import type { ITimestampMsec, MeterId } from '@tymlez/platform-api-interfaces';
import type { IMeterData } from '@tymlez/backend-libs';
import { Injectable, Logger } from '@nestjs/common';
import type { IMeterDataProvider } from '../interfaces/IMeterDataProvider.d';

@Injectable()
export class PeriodicMeterDataProvider implements IMeterDataProvider {
  constructor(private readonly logger: Logger) {}

  async getHistory(
    meterIds: MeterId[],
    from: Date,
    to: Date,
  ): Promise<IMeterData> {
    this.logger.log(from, to);
    return this.returnEmpty(meterIds);
  }

  async getRealtime(
    meterIds: MeterId[],
    limit: number,
    lastTimestmp?: ITimestampMsec,
  ): Promise<IMeterData> {
    this.logger.log(limit);
    this.logger.log(lastTimestmp);
    return this.returnEmpty(meterIds);
  }

  private returnEmpty(meterIds: MeterId[]) {
    return {
      meters: meterIds.map((meterId) => {
        return {
          meterId,
          data: [],
        };
      }),
    };
  }
}
