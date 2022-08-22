import type {
  ICarbonEmissionsRecord,
  ITimestampMsec,
  ISiteEmissionTotal,
} from '@tymlez/platform-api-interfaces';
// import { calcCarbonFromKWh } from '@tymlez/backend-libs';
import type { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { logger } from '@tymlez/backend-libs';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';
import { Site } from '../site/entities/Site.entity';

export class CarbonService {
  constructor(
    private meterQdbService: MeterQdbService,
    @InjectRepository(Site) private siteRepo: EntityRepository<Site>,
  ) {}

  async realtime(
    siteName: string,
    meterId: string,
    regionid: string,
    columns: string[],
    lastTimestamp: ITimestampMsec,
  ): Promise<ICarbonEmissionsRecord[]> {
    try {
      const site =
        (await this.siteRepo.findOne({ name: siteName })) ||
        (await this.siteRepo.findOne({ name: 'main' }));
      if (!site || !site.hasSolar || !site.solcastResourceId) {
        throw Error(
          'This site does not exist or does not have a solar PV to forecast',
        );
      } else {
        const result = await this.meterQdbService.getCarbonEmissionsRealtime(
          meterId,
          regionid,
          columns,
          site?.solcastResourceId,
          lastTimestamp,
        );
        return result.map<ICarbonEmissionsRecord>((r) => ({
          timestamp: r.timestamp.getTime(),
          consumption: r.consumption,
          generation: r.generation,
          produced: r.produced,
          saved: r.saved,
        }));
      }
    } catch (err) {
      logger.error({ err }, 'Get realtime carbon emissions error');
      throw err;
    }
  }

  async history(
    siteName: string,
    meterId: string,
    regionid: string,
    columns: string[],
    from: ITimestampMsec,
    to: ITimestampMsec,
  ): Promise<ICarbonEmissionsRecord[]> {
    try {
      const site =
        (await this.siteRepo.findOne({ name: siteName })) ||
        (await this.siteRepo.findOne({ name: 'main' }));
      if (!site || !site.hasSolar || !site.solcastResourceId) {
        throw Error(
          'This site does not exist or does not have a solar PV to forecast',
        );
      } else {
        const result = await this.meterQdbService.getCarbonEmissionsHistory(
          meterId,
          regionid,
          columns,
          site?.solcastResourceId,
          from,
          to,
        );
        return result.map<ICarbonEmissionsRecord>((r) => ({
          timestamp: r.timestamp.getTime(),
          consumption: r.consumption,
          generation: r.generation,
          produced: r.produced,
          saved: r.saved,
        }));
      }
    } catch (err) {
      logger.error({ err }, 'Get realtime carbon emissions error');
      throw err;
    }
  }

  async total(
    siteName: string,
    meterId: string,
    regionId: string,
    columns: string[],
  ): Promise<ISiteEmissionTotal> {
    try {
      const site =
        (await this.siteRepo.findOne({ name: siteName })) ||
        (await this.siteRepo.findOne({ name: 'main' }));
      if (!site || !site.hasSolar || !site.solcastResourceId) {
        throw Error(
          'This site does not exist or does not have a solar PV to forecast',
        );
      } else {
        return {
          last30d: {
            produced: await this.meterQdbService.getCarbonProducedLast30d(
              meterId,
              regionId,
              columns,
            ),
            saved: await this.meterQdbService.getCarbonSavedLast30d(
              site.solcastResourceId,
              regionId,
            ),
          },
          last24h: {
            produced: await this.meterQdbService.getCarbonProducedLast24h(
              meterId,
              regionId,
              columns,
            ),
            saved: await this.meterQdbService.getCarbonSavedLast24h(
              site.solcastResourceId,
              regionId,
            ),
          },
        };
      }
    } catch (err) {
      logger.error({ err }, 'Get total carbon emissions error');
      throw err;
    }
  }
}
