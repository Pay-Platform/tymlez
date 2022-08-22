import { Injectable } from '@nestjs/common';
import type {
  IConsumptionHistoryRecord,
  IConsumptionRealtimeRecord,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';
import { PinoLogger } from 'nestjs-pino';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';

@Injectable()
export class ConsumptionService {
  constructor(
    private meterQdbService: MeterQdbService,
    private readonly logger: PinoLogger,
  ) {}

  async realtime(
    meterId: string,
    columns: string[],
    lastTimestamp?: ITimestampMsec,
  ): Promise<IConsumptionRealtimeRecord[]> {
    const realtimeRecords = await this.meterQdbService.getConsumptionRealtime(
      meterId,
      columns,
      lastTimestamp,
    );
    this.logger.info({ realtimeRecords }, 'Realtime Consumption records::');
    const mappedRealtimeRecords = realtimeRecords.map((realtimeRecord) => ({
      meterId: realtimeRecord.meterId,
      timestamp: new Date(realtimeRecord.timestamp).getTime(),
      value: realtimeRecord.value,
    }));
    return mappedRealtimeRecords as IConsumptionRealtimeRecord[];
  }

  history(
    siteName: string,
    from: ITimestampMsec,
    to: ITimestampMsec,
    meterId: string,
    columns: string[],
  ): Promise<Array<IConsumptionHistoryRecord>> {
    this.logger.info('History CosumptionService: SiteName: ', siteName);
    return this.meterQdbService.getConsumptionHistory(
      meterId,
      columns,
      from,
      to,
    );
  }
}
