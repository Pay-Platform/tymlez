import { EntityManager } from '@mikro-orm/postgresql';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type {
  IAddQueryResult,
  IChannel,
  IMeter,
  IQueryMeter,
} from '@tymlez/platform-api-interfaces';
import type { ICircuitMap, IMeterInfoService } from '@tymlez/backend-libs';
import { SiteService } from '../site/site.service';
import { Site } from '../site/entities/Site.entity';
import { Channel } from './entities/Channel.entity';
import { Meter } from './entities/Meter.entity';
import type { MeterDto } from './dto/meter.dto';

@Injectable()
export class MeterInfoService implements IMeterInfoService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: EntityRepository<Site>,
    @InjectRepository(Meter)
    private readonly meterRepository: EntityRepository<Meter>,
    @InjectRepository(Channel)
    private readonly channelRepository: EntityRepository<Channel>,
    private readonly em: EntityManager,
    private siteService: SiteService,
  ) {}

  public async getMetersByClient(
    clientName: string,
  ): Promise<(IMeter & { channels: IChannel[] })[]> {
    const sites = await this.siteRepository.findAll({
      filters: { client: { name: clientName } },
    });

    const meters = (
      await Promise.all(
        sites.map((site) => this.getMetersChannelsBySite(site.name)),
      )
    ).flat();

    return meters;
  }

  public async getMetersChannelsBySite(
    siteName: string,
  ): Promise<(IMeter & { channels: IChannel[] })[]> {
    const meters = await this.getMetersBySite(siteName);

    const metersWithChannels = await Promise.all(
      meters.map(async (meter) => {
        const channels = await this.channelRepository.findAll({
          filters: {
            meter: { name: meter.name },
          },
        });

        return {
          ...meter,
          channels,
        };
      }),
    );

    return metersWithChannels;
  }

  public async getMeterListByClient(
    clientName: string,
    query: any,
  ): Promise<IMeter[]> {
    const sites = await this.siteService.getSites(clientName, query);
    if (sites === null || sites.length === 0) {
      return [];
    }
    const siteWithMeters = await Promise.all(
      sites.map(async (site) => {
        const meters = await this.getMetersBySite(site.name);

        return {
          site,
          meters,
        };
      }),
    );

    let meters: IMeter[] = [];
    siteWithMeters.forEach((x) => {
      if (x.meters.length !== 0) {
        meters = meters.concat(x.meters);
      }
    });

    return meters;
  }

  public async getMetersBySite(siteName: string): Promise<IMeter[]> {
    return await this.meterRepository.find({
      site: { name: siteName },
    });
  }

  public async getMeterDetail(meterName: string): Promise<IMeter | null> {
    return await this.meterRepository.findOne({ name: meterName });
  }

  public async getMainMeterBySite(siteName: string): Promise<IMeter | null> {
    return await this.meterRepository.findOne({
      site: { name: siteName },
      isMain: true,
    });
  }

  public async getCircuitMapBySite(siteName: string): Promise<ICircuitMap> {
    const qb = this.em.createQueryBuilder(Channel, 'ch');
    qb.select([
      'ci.label',
      'm.meter_id',
      'm.is_main',
      'array_agg(ch.index) as indexes',
    ])
      .join('ch.circuit', 'ci')
      .join('ci.meter', 'm')
      .where({ 'm.site_name': siteName })
      .groupBy(['ci.label', 'm.meter_id', 'm.is_main'])
      .orderBy({ 'ci.label': 'ASC' });

    // console.log('query', qb.getQuery());

    const circuits = await qb.execute();
    return {
      circuits: circuits.map((record: any) => ({
        label: record.label,
        meterId: record.meter_id,
        isMain: record.is_main,
        indexes: record.indexes,
      })),
    };
  }

  async getAllMeters(query: any): Promise<IQueryMeter> {
    const [meters, total] = await this.meterRepository.findAndCount(
      {},
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
      },
    );
    return { total, meters };
  }

  private checkInputInfo(meter: MeterDto) {
    const message = [];
    if (meter.name === '') {
      message.push(`Name should not be empty`);
    }
    if (meter.label === '') {
      message.push('Label should not be empty');
    }
    if (meter.description === '') {
      message.push('Address should not be empty');
    }

    return message;
  }

  public async addMeter(meter: MeterDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(meter);
    if ((await this.getMeterDetail(meter.name)) !== null) {
      message.push('Meter name already exists');
    }

    const site = await this.siteService.getSiteDetail(meter.site.name);
    if (site === null) {
      message.push('Site does not exist');
    }

    console.log('test add meter', meter, site);
    if (message.length === 0) {
      const toBeInsert = new Meter();

      toBeInsert.name = meter.name;
      toBeInsert.meter_id = meter.meter_id;
      toBeInsert.label = meter.label;
      toBeInsert.description = meter.description;
      toBeInsert.type = meter.type;
      toBeInsert.lat = meter.lat;
      toBeInsert.lng = meter.lng;
      toBeInsert.interval = meter.interval;
      toBeInsert.billingChannelIndex = meter.billingChannelIndex;
      toBeInsert.isMain = meter.isMain;
      toBeInsert.site = site as Site;
      toBeInsert.createdAt = new Date();
      toBeInsert.tags = ['initial'];
      toBeInsert.apiKey = meter.apiKey;
      toBeInsert.status = meter.status;
      toBeInsert.activeFrom = meter.activeFrom;
      await this.em.persistAndFlush(toBeInsert);

      return {
        success: true,
      };
    }
    return {
      success: false,
      message,
    };
  }

  public async updateMeter(meter: MeterDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(meter);

    const toBeUpdate = (await this.getMeterDetail(meter.name)) as IMeter;
    if (message.length !== 0) {
      return {
        success: false,
        message,
      };
    }

    toBeUpdate.name = meter.name;
    toBeUpdate.label = meter.label;
    toBeUpdate.description = meter.description;
    toBeUpdate.lat = meter.lat;
    toBeUpdate.lng = meter.lng;
    toBeUpdate.meter_id = meter.meter_id;
    toBeUpdate.type = meter.type;
    toBeUpdate.interval = meter.interval;
    toBeUpdate.billingChannelIndex = meter.billingChannelIndex;
    toBeUpdate.isMain = meter.isMain;
    toBeUpdate.site = meter.site;
    toBeUpdate.apiKey = meter.apiKey;
    toBeUpdate.status = meter.status;
    toBeUpdate.activeFrom = meter.activeFrom;
    await this.em.persistAndFlush(toBeUpdate);
    return {
      success: true,
    };
  }
}
