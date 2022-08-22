import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import { PinoLogger } from 'nestjs-pino';
import type {
  IConsumptionHistoryRecord,
  IForecastType,
  IGenerationForecastRecordSeries,
  IGenerationForecastRecord,
  ITimestampMsec,
  ICarbonEmissionsRecord,
  ISiteEmissionTotal,
} from '@tymlez/platform-api-interfaces';
import type {
  ICohortDashboard,
  ICohortSiteDetail,
  ICohortConsumptionRecord,
} from '@tymlez/cohort-api-interfaces';
import {
  getConsumptionHistory,
  getConsumptionRealtime,
} from './libs/consumption';
import {
  getGenerationForecast,
  getGenerationHistory,
  getGenerationForecast24h,
} from './libs/generation';
import { getSiteDetails, getSites } from './libs/sites';
import {
  Channel,
  findChannelIndexes,
  getMeterBySiteName,
  Meter,
} from './libs/meters';

import {
  getCarbonEmissionsRealtime,
  getCarbonEmissionsHistory,
  getCarbonEmissionsTotal,
} from './libs/carbon';

@Injectable()
export class DashboardService {
  constructor(
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  async getDashboardOverview({
    authorizationHeader,
  }: {
    authorizationHeader: string;
  }): Promise<ICohortDashboard> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);

    return {
      sites: await getSites({ platformApiHost, authorizationHeader }),
    };
  }

  async getConsumptionRealtime({
    correlationId,
    authorizationHeader,
    siteName,
    since,
  }: {
    correlationId: string;
    authorizationHeader: string;
    siteName: string;
    since?: ITimestampMsec;
  }): Promise<ICohortConsumptionRecord[]> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);
    const meters: (Meter & { channels: Channel[] })[] =
      await getMeterBySiteName({
        correlationId,
        platformApiHost,
        authorizationHeader,
        siteName,
      });
    let requiredMeters: (Meter & { channels: Channel[] })[] | undefined;
    if (meters.length > 0) {
      requiredMeters = meters?.filter((meter) => meter.isMain);
    }
    if (requiredMeters && requiredMeters?.length > 0) {
      // groupBy MeterIds
      const groupedByMeterIdAndConsumptionColumns: Record<string, string> = {};
      for (let index = 0; index < requiredMeters.length; index++) {
        const consumptionColumns = findChannelIndexes(
          requiredMeters[index].channels,
          requiredMeters[index].name,
        )
          .map((activeChannelIndex) => `eRealPositiveKwh_${activeChannelIndex}`)
          .join(',');
        groupedByMeterIdAndConsumptionColumns[requiredMeters[index].meter_id] =
          consumptionColumns;
      }

      const consumptionRecords = await Promise.all(
        requiredMeters.map(async (requiredMeter) => {
          return await getConsumptionRealtime({
            correlationId,
            authorizationHeader,
            platformApiHost,
            meterId: requiredMeter.meter_id,
            columns:
              groupedByMeterIdAndConsumptionColumns[requiredMeter.meter_id],
            since,
          });
        }),
      );

      const consumptionRealtimeRecords = consumptionRecords
        .flat()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        .map((consumptionRecord) => {
          return {
            ...consumptionRecord,
            timestamp: new Date(consumptionRecord.timestamp).getTime(),
          };
        }) as ICohortConsumptionRecord[];
      return consumptionRealtimeRecords;
    }
    return [] as ICohortConsumptionRecord[];
  }

  async getConsumptionHistory({
    correlationId,
    authorizationHeader,
    siteName,
    from,
    to,
  }: {
    correlationId: string;
    authorizationHeader: string;
    siteName: string;
    from: ITimestampMsec;
    to: ITimestampMsec;
  }): Promise<ICohortConsumptionRecord[]> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);
    const meters: (Meter & { channels: Channel[] })[] =
      await getMeterBySiteName({
        correlationId,
        platformApiHost,
        authorizationHeader,
        siteName,
      });
    let requiredMeters: (Meter & { channels: Channel[] })[] | undefined;
    if (meters.length > 0) {
      requiredMeters = meters?.filter((meter) => meter.isMain);
    }
    if (requiredMeters && requiredMeters?.length > 0) {
      // groupBy MeterIds
      const groupedByMeterIdAndConsumptionColumns: Record<string, string> = {};
      for (let index = 0; index < requiredMeters.length; index++) {
        const consumptionColumns = findChannelIndexes(
          requiredMeters[index].channels,
          requiredMeters[index].name,
        )
          .map(
            (activeChannelIndex: any) =>
              `eRealPositiveKwh_${activeChannelIndex}`,
          )
          .join(',');
        groupedByMeterIdAndConsumptionColumns[requiredMeters[index].meter_id] =
          consumptionColumns;
      }

      const consumptionRecords = await Promise.all(
        requiredMeters.map(async (requiredMeter) => {
          return await getConsumptionHistory({
            correlationId,
            authorizationHeader,
            platformApiHost,
            siteName,
            from,
            to,
            meterId: requiredMeter.meter_id,
            columns:
              groupedByMeterIdAndConsumptionColumns[requiredMeter.meter_id],
          });
        }),
      );

      const consumptionHistoryRecords = consumptionRecords
        .flat()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        .map((consumptionRecord) => {
          return {
            ...consumptionRecord,
            timestamp: new Date(consumptionRecord.timestamp).getTime(),
          };
        }) as ICohortConsumptionRecord[];
      return consumptionHistoryRecords;
    }
    return [] as IConsumptionHistoryRecord[];
  }

  getSumOfObjectProperties(object: any, keys: string[]) {
    let sum = 0;
    for (const key in object) {
      if (
        Object.prototype.hasOwnProperty.call(object, key) &&
        keys.includes(key)
      ) {
        sum += object[key];
      }
    }
    return sum;
  }

  async getGenerationForecast({
    authorizationHeader,
    siteName,
    since,
    forecastType,
  }: {
    authorizationHeader: string;
    siteName: string;
    since: ITimestampMsec;
    forecastType: IForecastType;
  }): Promise<IGenerationForecastRecordSeries> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);

    return await getGenerationForecast({
      platformApiHost,
      siteName,
      since,
      forecastType,
      authorizationHeader,
    });
  }

  async getGenerationHistory({
    authorizationHeader,
    siteName,
    from,
    to,
    forecastType,
  }: {
    authorizationHeader: string;
    siteName: string;
    from: ITimestampMsec;
    to: ITimestampMsec;
    forecastType: IForecastType;
  }): Promise<IGenerationForecastRecordSeries> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);

    return await getGenerationHistory({
      platformApiHost,
      siteName,
      from,
      to,
      forecastType,
      authorizationHeader,
    });
  }

  async getGenerationForecast24h({
    authorizationHeader,
    siteName,
  }: {
    authorizationHeader: string;
    siteName: string;
  }): Promise<IGenerationForecastRecord> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);

    return await getGenerationForecast24h({
      platformApiHost,
      siteName,
      authorizationHeader,
    });
  }

  async getSiteDetail({
    siteName,
    authorizationHeader,
    correlationId,
  }: {
    authorizationHeader: string;
    siteName: string;
    correlationId: string;
  }): Promise<ICohortSiteDetail> {
    const platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
    assert(platformApiHost, `PLATFORM_API_HOST is missing`);

    const site = await getSiteDetails({
      platformApiHost,
      authorizationHeader,
      siteName,
      correlationId,
    });

    const metersForSite = await getMeterBySiteName({
      platformApiHost,
      authorizationHeader,
      siteName,
      correlationId,
    });
    this.logger.debug(site);
    if (!site) {
      throw new NotFoundException();
    }

    return {
      ...site,
      meters: metersForSite,
    };
  }

  getDefaultSiteName() {
    return 'main';
    //return Object.keys(demoSites)[0];
  }

  async getCarbonEmissionsRealtime({
    authorizationHeader,
    correlationId,
    siteName,
    since,
  }: {
    authorizationHeader: string;
    correlationId: string;
    siteName: string;
    since: ITimestampMsec;
  }): Promise<ICarbonEmissionsRecord[]> {
    try {
      const platformApiHost =
        this.configService.get<string>('PLATFORM_API_HOST');
      assert(platformApiHost, `PLATFORM_API_HOST is missing`);
      const meters: (Meter & { channels: Channel[] })[] =
        await getMeterBySiteName({
          correlationId,
          platformApiHost,
          authorizationHeader,
          siteName,
        });
      let requiredMeters: (Meter & { channels: Channel[] })[] | undefined;
      if (meters.length > 0) {
        requiredMeters = meters?.filter((meter) => meter.isMain);
      }
      if (requiredMeters && requiredMeters?.length > 0) {
        // groupBy MeterIds
        const groupedByMeterIdAndConsumptionColumns: Record<string, string> =
          {};
        for (let index = 0; index < requiredMeters.length; index++) {
          const consumptionColumns = findChannelIndexes(
            requiredMeters[index].channels,
            requiredMeters[index].name,
          )
            .map(
              (activeChannelIndex) => `eRealPositiveKwh_${activeChannelIndex}`,
            )
            .join(',');
          groupedByMeterIdAndConsumptionColumns[
            requiredMeters[index].meter_id
          ] = consumptionColumns;
        }
        const carbonEmissionRecords = await Promise.all(
          requiredMeters.map(async (requiredMeter) => {
            return await getCarbonEmissionsRealtime({
              correlationId,
              authorizationHeader,
              platformApiHost,
              siteName,
              meterId: requiredMeter.meter_id,
              regionId: 'QLD1',
              columns:
                groupedByMeterIdAndConsumptionColumns[requiredMeter.meter_id],
              since,
            });
          }),
        );

        const consumptionRealtimeRecords = carbonEmissionRecords
          .flat()
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          .map((carbonEmissionsRecord) => {
            return {
              ...carbonEmissionsRecord,
              timestamp: new Date(carbonEmissionsRecord.timestamp).getTime(),
            };
          }) as ICarbonEmissionsRecord[];
        return consumptionRealtimeRecords;
      }
      return [] as ICarbonEmissionsRecord[];
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon emission real time');
      throw err;
    }
  }

  async getCarbonEmissionsHistory({
    authorizationHeader,
    correlationId,
    siteName,
    from,
    to,
  }: {
    authorizationHeader: string;
    correlationId: string;
    siteName: string;
    from: ITimestampMsec;
    to: ITimestampMsec;
  }): Promise<ICarbonEmissionsRecord[]> {
    try {
      const platformApiHost =
        this.configService.get<string>('PLATFORM_API_HOST');
      assert(platformApiHost, `PLATFORM_API_HOST is missing`);
      const meters: (Meter & { channels: Channel[] })[] =
        await getMeterBySiteName({
          correlationId,
          platformApiHost,
          authorizationHeader,
          siteName,
        });
      let requiredMeters: (Meter & { channels: Channel[] })[] | undefined;
      if (meters.length > 0) {
        requiredMeters = meters?.filter((meter) => meter.isMain);
      }
      if (requiredMeters && requiredMeters?.length > 0) {
        // groupBy MeterIds
        const groupedByMeterIdAndConsumptionColumns: Record<string, string> =
          {};
        for (let index = 0; index < requiredMeters.length; index++) {
          const consumptionColumns = findChannelIndexes(
            requiredMeters[index].channels,
            requiredMeters[index].name,
          )
            .map(
              (activeChannelIndex) => `eRealPositiveKwh_${activeChannelIndex}`,
            )
            .join(',');
          groupedByMeterIdAndConsumptionColumns[
            requiredMeters[index].meter_id
          ] = consumptionColumns;
        }
        const carbonEmissionRecords = await Promise.all(
          requiredMeters.map(async (requiredMeter) => {
            return await getCarbonEmissionsHistory({
              correlationId,
              authorizationHeader,
              platformApiHost,
              siteName,
              meterId: requiredMeter.meter_id,
              regionId: 'QLD1',
              columns:
                groupedByMeterIdAndConsumptionColumns[requiredMeter.meter_id],
              from,
              to,
            });
          }),
        );

        const consumptionRealtimeRecords = carbonEmissionRecords
          .flat()
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          .map((carbonEmissionsRecord) => {
            return {
              ...carbonEmissionsRecord,
              timestamp: new Date(carbonEmissionsRecord.timestamp).getTime(),
            };
          }) as ICarbonEmissionsRecord[];
        return consumptionRealtimeRecords;
      }
      return [] as ICarbonEmissionsRecord[];
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon emission history');
      throw err;
    }
  }

  async getCarbonEmissionsTotal({
    authorizationHeader,
    correlationId,
    siteName,
  }: {
    authorizationHeader: string;
    correlationId: string;
    siteName: string;
  }): Promise<ISiteEmissionTotal> {
    try {
      const platformApiHost =
        this.configService.get<string>('PLATFORM_API_HOST');
      assert(platformApiHost, `PLATFORM_API_HOST is missing`);
      const meters: (Meter & { channels: Channel[] })[] =
        await getMeterBySiteName({
          correlationId,
          platformApiHost,
          authorizationHeader,
          siteName,
        });
      let requiredMeters: (Meter & { channels: Channel[] })[] | undefined;
      if (meters.length > 0) {
        requiredMeters = meters?.filter((meter) => meter.isMain);
      }
      if (requiredMeters && requiredMeters?.length > 0) {
        // groupBy MeterIds
        const groupedByMeterIdAndConsumptionColumns: Record<string, string> =
          {};
        for (let index = 0; index < requiredMeters.length; index++) {
          const consumptionColumns = findChannelIndexes(
            requiredMeters[index].channels,
            requiredMeters[index].name,
          )
            .map(
              (activeChannelIndex) => `eRealPositiveKwh_${activeChannelIndex}`,
            )
            .join(',');
          groupedByMeterIdAndConsumptionColumns[
            requiredMeters[index].meter_id
          ] = consumptionColumns;
        }
        const carbonEmissionTotalRecords = await Promise.all(
          requiredMeters.map(async (requiredMeter) => {
            return await getCarbonEmissionsTotal({
              correlationId,
              authorizationHeader,
              platformApiHost,
              siteName,
              meterId: requiredMeter.meter_id,
              regionId: 'QLD1',
              columns:
                groupedByMeterIdAndConsumptionColumns[requiredMeter.meter_id],
            });
          }),
        );

        return carbonEmissionTotalRecords.reduce(
          (result: ISiteEmissionTotal, record: ISiteEmissionTotal) => {
            // eslint-disable-next-line no-param-reassign
            result.last30d.produced += record.last30d.produced;
            // eslint-disable-next-line no-param-reassign
            result.last30d.saved += record.last30d.saved;
            // eslint-disable-next-line no-param-reassign
            result.last24h.produced += record.last24h.produced;
            // eslint-disable-next-line no-param-reassign
            result.last24h.saved += record.last24h.saved;
            return result;
          },
          {
            last30d: { produced: 0, saved: 0 },
            last24h: { produced: 0, saved: 0 },
          },
        );
      }
      return {
        last30d: { produced: 0, saved: 0 },
        last24h: { produced: 0, saved: 0 },
      } as ISiteEmissionTotal;
    } catch (err) {
      this.logger.error({ err }, 'Cannot get carbon emision total');
      throw err;
    }
  }
}

const dates = [Date.now() - 24 * 60 * 60000];
let date = dates[0];
while (date < Date.now()) {
  date += 3600000;
  dates.push(date);
}
