import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type {
  IAddQueryResult,
  IChannel,
  IQueryChannel,
} from '@tymlez/platform-api-interfaces';
import { Channel } from './entities/Channel.entity';
import type { Meter } from './entities/Meter.entity';
import { MeterInfoService } from './meter-info.service';
import { CircuitService } from './circuit.service';
import type { Circuit } from './entities/Circuit.entity';
import type { ChannelDto } from './dto/channel.dto';
import { SiteService } from '../site/site.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: EntityRepository<Channel>,
    private meterInfoService: MeterInfoService,
    private circuitService: CircuitService,
    private siteService: SiteService,
    private readonly em: EntityManager,
  ) {}

  public async getChannelsBySite(siteName: string): Promise<IChannel[]> {
    const circuits = await this.circuitService.getCircuitsBySite(siteName);
    if (circuits.length === 0) {
      return [];
    }

    const circuitNames = circuits.map((x) => `'${x.name}'`);
    const qb = this.em
      .createQueryBuilder(Channel)
      .where(`circuit_name in (${circuitNames})`)
      .select(`*`);
    return await qb.execute('all');
  }

  public async getChannelsByClient(
    clientName: string,
    query: any,
  ): Promise<IChannel[]> {
    const sites = await this.siteService.getSites(clientName, query);
    if (sites === null || sites.length === 0) {
      return [];
    }

    const siteWithChannels = await Promise.all(
      sites.map(async (site) => {
        const channels = await this.getChannelsBySite(site.name);
        return {
          site,
          channels,
        };
      }),
    );

    let channels: IChannel[] = [];
    siteWithChannels.forEach((x) => {
      if (x.channels.length !== 0) {
        channels = channels.concat(x.channels);
      }
    });

    return channels;
  }

  public async getChannelDetail(channelName: string): Promise<IChannel | null> {
    return await this.channelRepository.findOne({ name: channelName });
  }

  async getAllChannels(query: any): Promise<IQueryChannel> {
    const [channels, total] = await this.channelRepository.findAndCount(
      {},
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
      },
    );
    return { total, channels };
  }

  private checkInputInfo(channel: ChannelDto) {
    const message = [];
    if (channel.name === '') {
      message.push(`Name should not be empty`);
    }
    if (channel.label === '') {
      message.push('Label should not be empty');
    }

    return message;
  }

  public async addChannel(channel: ChannelDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(channel);
    const existingChannel = await this.getChannelDetail(channel.name);
    if (existingChannel !== null) {
      message.push('Channel name already exists');
    }
    const meter = await this.meterInfoService.getMeterDetail(
      channel.meter.name,
    );
    if (meter === null) {
      message.push('Meter does not exist');
    }
    const circuit = await this.circuitService.getCircuitDetail(
      channel.circuit.name,
    );
    if (circuit === null) {
      message.push('Circuit does not exist');
    }
    if (message.length === 0) {
      const toBeInsert = new Channel();
      toBeInsert.name = channel.name;
      toBeInsert.label = channel.label;
      toBeInsert.meter = meter as Meter;
      toBeInsert.circuit = circuit as Circuit;
      toBeInsert.index = channel.index;
      toBeInsert.createdAt = new Date();
      toBeInsert.tags = ['initial'];
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

  // public async updateChannel(channel: ChannelDto): Promise<IAddQueryResult> {
  //   const message = this.checkInputInfo(channel);

  //   const toBeUpdate :IChannel = (await this.getChannelDetail(channel)).name)) as IChannel;
  //   if (message.length !== 0) {
  //     return {
  //       success: false,
  //       message,
  //     };
  //   }

  //   toBeUpdate.name = circuit.name;
  //   toBeUpdate.label = circuit.label;
  //   toBeUpdate.meter = circuit.meter;
  //   await this.em.persistAndFlush(toBeUpdate);
  //   return {
  //     success: true,
  //   };
  // }
}
