import _, { random } from 'lodash';
import { Injectable } from '@nestjs/common';
import type {
  IGenerationForecastRecord,
  UUID,
} from '@tymlez/platform-api-interfaces';

@Injectable()
export class MeterQdbServiceMock {
  async getSolarGenerationForecast(
    resourceId: UUID,
    sampleInterval: IQUESTDB_INTERVALS,
    fromDate: Date,
    toDate: Date,
  ): Promise<Array<IGenerationForecastRecord>> {
    const results = [] as Array<IGenerationForecastRecord>;
    let period = 24 * 60 * 60 * 1000;
    let factor = 48;

    if (sampleInterval === IQUESTDB_INTERVALS.hourly) {
      period = 60 * 60 * 1000;
      factor = 2;
    }

    if (sampleInterval === IQUESTDB_INTERVALS.fiveMinutes) {
      period = 5 * 60 * 1000;
      factor = 0.2;
    }

    for (
      let periodEnd = fromDate.getTime();
      periodEnd < toDate.getTime();
      periodEnd += period
    ) {
      const estimated = _.round(random(0, 80, true), 3) * factor;

      results.push({
        resourceId,
        period,
        periodEnd,
        estimated,
      });
    }
    return results;
  }
}

export enum IQUESTDB_INTERVALS {
  hourly = '1h',
  daily = '1d',
  fiveMinutes = '5m',
}
