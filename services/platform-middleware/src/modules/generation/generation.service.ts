import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository } from '@mikro-orm/core';
import type {
  IForecastType,
  IGenerationForecastRecordSeries,
  IGenerationForecastRecord,
} from '@tymlez/platform-api-interfaces';
import {
  IQUESTDB_INTERVALS,
  MeterQdbService,
} from '../meter-qdb/meter-qdb.service';
import type { IGenerationForecastHandler } from './interfaces/igeneration-forecast-handler.interface';
import { Site } from '../site/entities/Site.entity';

@Injectable()
export class GenerationService implements IGenerationForecastHandler {
  constructor(
    private meterQdbService: MeterQdbService,
    @InjectRepository(Site) private siteRepo: EntityRepository<Site>,
  ) {}

  async forecastSolarGeneration(
    siteName: string,
    forecastType: IForecastType,
    from: Date,
    to: Date | undefined = undefined,
  ): Promise<IGenerationForecastRecordSeries> {
    const site =
      (await this.siteRepo.findOne({ name: siteName })) ||
      (await this.siteRepo.findOne({ name: 'main' }));

    if (!site || !site.hasSolar || !site.solcastResourceId) {
      throw Error(
        'This site does not exist or does not have a solar PV to forecast',
      );
    } else {
      const fromDate = from ? from.getTime() : Date.now();

      const toDate = to ? to.getTime() : fromDate + 7 * 24 * 60 * 60 * 1000;

      let sampleInterval = IQUESTDB_INTERVALS.daily;

      if (forecastType === 'hourly') {
        sampleInterval = IQUESTDB_INTERVALS.hourly;
      }

      if (forecastType === 'fiveMin') {
        sampleInterval = IQUESTDB_INTERVALS.fiveMinutes;
      }

      return [
        {
          sourceType: 'Solar',
          series: await this.meterQdbService.getSolarGenerationForecast(
            site.solcastResourceId,
            sampleInterval,
            new Date(fromDate),
            new Date(toDate),
          ),
        },
      ];
    }
  }

  async forecastSolarGeneration24h(
    siteName: string,
    from: Date,
  ): Promise<IGenerationForecastRecord> {
    const site =
      (await this.siteRepo.findOne({ name: siteName })) ||
      (await this.siteRepo.findOne({ name: 'main' }));

    if (!site || !site.hasSolar || !site.solcastResourceId) {
      throw Error(
        'This site does not exist or does not have a solar PV to forecast',
      );
    } else {
      const fromDate = from ? from.getTime() : Date.now();

      const toDate = fromDate + 24 * 60 * 60 * 1000;
      const records = await this.meterQdbService.getSolarGenerationForecast(
        site.solcastResourceId,
        IQUESTDB_INTERVALS.daily,
        new Date(fromDate),
        new Date(toDate),
      );
      return records[0];
    }
  }
}
