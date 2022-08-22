import { Injectable, Logger } from '@nestjs/common';
import type {
  IOrigin,
  ITimestampMsec,
  IConsumptionHistoryRecord,
  ISourceCategory,
} from '@tymlez/platform-api-interfaces';
import _ from 'lodash';
import type { IConsumptionHistoryHandler } from '../interfaces/iconsumption-history-handler.interface';

@Injectable()
export class ConsumptionHistoryService implements IConsumptionHistoryHandler {
  constructor(private readonly logger: Logger) {}

  private generateHistoryRecords(from: ITimestampMsec, to: ITimestampMsec) {
    let startDate = from;
    const endDate = to;
    const consumptionHistory: IConsumptionHistoryRecord[] = [];

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
    while (endDate > startDate) {
      consumptionHistory.push({
        timestamp: startDate,
        value: _.random(30, 70, true),
        consumerType: _.sample(['Lighting', 'Freezers', 'HVAC']) as string, // Lighting/Freezers/HVAC
        sourceType: _.sample(['Solar', 'Wind', 'Coal']) as string, // Solar/Wind/Coal
        origin: _.sample(['Self-generated', 'Purchased']) as IOrigin, // Self-generated/Purchased
        meterId: _.sample(meters) as string, // uuid-v4
        sourceCategory: sourceCategory as ISourceCategory,
      });

      // Increment by an hour
      startDate += 60 * 60 * 1000;
    }
    return consumptionHistory;
  }

  async history(
    siteName: string,
    from: ITimestampMsec,
    to: ITimestampMsec,
  ): Promise<Array<IConsumptionHistoryRecord>> {
    this.logger.log('History Consumption SiteName: ', siteName);
    return this.generateHistoryRecords(from, to);
  }
}
