import { Injectable } from '@nestjs/common';
import type {
  IOrigin,
  ITimestampMsec,
  IConsumptionRealtimeRecord,
  ISourceCategory,
} from '@tymlez/platform-api-interfaces';
import _ from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import type { IConsumptionRealtimeHandler } from '../interfaces/iconsumption-realtime-handler.interface';

@Injectable()
export class ConsumptionRealtimeService implements IConsumptionRealtimeHandler {
  constructor(private readonly logger: PinoLogger) {}

  private generateRealtimeData() {
    const sources = ['Solar', 'Wind', 'Coal'];
    const sourceType = _.sample(sources) as string;
    const meters = [
      'meterId1',
      'meterId2',
      'meterId3',
      'meterId4',
      'meterId5',
      'meterId6',
    ];

    let sourceCategory = 'GE';
    if (sourceType === 'Coal') {
      sourceCategory = 'Fossil Fuel';
    }
    return {
      value: Number(_.random(20, 50, true).toFixed(4)), //return float number between 20 and 50(inclusive)
      consumerType: _.sample(['Lighting', 'Freezers', 'HVAC']) as string, // Lighting/Freezers/HVAC
      sourceType, // Solar/Wind/Coal
      origin: _.sample(['Self-generated', 'Purchased']) as IOrigin, // Self-generated/Purchased
      meterId: _.sample(meters) as string,
      sourceCategory: sourceCategory as ISourceCategory,
    };
  }

  async realtime(
    siteName: string,
    since: ITimestampMsec,
    getFromCache: boolean,
  ): Promise<IConsumptionRealtimeRecord[]> {
    this.logger.info('Realtime Consumption SiteName:: ', siteName);
    const consumptionRealtimeRecords: IConsumptionRealtimeRecord[] = [];

    // for the first call from client send all  the data from cache since since will be undefined
    if (getFromCache) {
      let startTime = since - 5 * 5 * 1000;
      while (startTime <= since) {
        for (let i = 0; i < 6; i++) {
          const realtimeRecord = this.generateRealtimeData();
          consumptionRealtimeRecords.push({
            ...realtimeRecord,
            timestamp: startTime,
          });
        }
        // increment by 15msecs
        startTime += 5 * 1000;
      }
      return consumptionRealtimeRecords;
    }

    const realtimeRecord = this.generateRealtimeData();
    consumptionRealtimeRecords.push({
      ...realtimeRecord,
      timestamp: Date.now(),
    });

    return consumptionRealtimeRecords;
  }
}
