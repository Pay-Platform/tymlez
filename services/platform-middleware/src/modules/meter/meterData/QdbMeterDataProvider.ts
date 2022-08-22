import type { ITimestampMsec, MeterId } from '@tymlez/platform-api-interfaces';
import { Injectable } from '@nestjs/common';
import type { IMeterData } from '@tymlez/backend-libs';
import type { IMeterDataProvider } from '../interfaces/IMeterDataProvider.d';
import {
  MeterQdbService,
  QdbMeterData,
} from '../../meter-qdb/meter-qdb.service';

@Injectable()
export class QdbMeterDataProvider implements IMeterDataProvider {
  constructor(private meterQdbService: MeterQdbService) {}

  public async getHistory(
    meterIds: MeterId[],
    from: Date,
    to: Date,
  ): Promise<IMeterData> {
    return this.qdbDataToMeterData(
      await this.meterQdbService.getMetersHistory(meterIds, from, to),
    );
  }

  public async getRealtime(
    meterIds: MeterId[],
    limit: number,
    since?: ITimestampMsec,
  ): Promise<IMeterData> {
    return this.qdbDataToMeterData(
      await this.meterQdbService.getMetersRealtime(
        meterIds,
        limit,
        since ? new Date(since) : undefined,
      ),
    );
  }

  private qdbDataToMeterData(qdbData: QdbMeterData): IMeterData {
    return {
      meters: qdbData.meters.map((qdbSeries) => ({
        meterId: qdbSeries.meterId,
        data: qdbSeries.data.map((qdbRecord) => ({
          timestamp: new Date(qdbRecord.timestamp).getTime(),
          values: [
            qdbRecord.channel0,
            qdbRecord.channel1,
            qdbRecord.channel2,
            qdbRecord.channel3,
            qdbRecord.channel4,
            qdbRecord.channel5,
          ],
        })),
      })),
    };
  }
}
