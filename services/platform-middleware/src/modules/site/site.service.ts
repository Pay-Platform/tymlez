import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type {
  IAddQueryResult,
  IClient,
  IQuerySite,
  ISite,
} from '@tymlez/platform-api-interfaces';
import { Site } from './entities/Site.entity';
import { Client } from '../auth/entities/Client.entity';
import type { SiteDto } from './dto/site.dto';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site) private siteRepo: EntityRepository<Site>,
    @InjectRepository(Client) private clientRepo: EntityRepository<Client>,
    private readonly em: EntityManager,
  ) {}

  async getAllSites(query: any): Promise<IQuerySite> {
    const [sites, total] = await this.siteRepo.findAndCount(
      {},
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
      },
    );
    return { total, sites };
  }

  async getSiteDetail(siteName: string): Promise<ISite | null> {
    return await this.siteRepo.findOne({ name: siteName });
  }

  public async getClientDetail(clientName: string): Promise<IClient | null> {
    return await this.clientRepo.findOne({ name: clientName });
  }

  private checkInputInfo(site: SiteDto) {
    const message = [];
    if (site.name === '') {
      message.push(`Name should not be empty`);
    }
    if (site.label === '') {
      message.push('Label should not be empty');
    }
    if (site.address === '') {
      message.push('Address should not be empty');
    }
    if (site.lat === 0) {
      message.push('Lat should not be 0');
    }
    if (site.lng === 0) {
      message.push('Lng should not be 0');
    }
    return message;
  }

  public async addSite(site: SiteDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(site);

    const client = await this.getClientDetail(site.client.name);
    if (client === null) {
      message.push(`Cannot find client '${site.client.name}'`);
    }
    const existingSite = await this.siteRepo.findOne({ name: site.name });
    if (existingSite !== null) {
      message.push('Site name already exists');
    }
    if (message.length === 0) {
      const toBeInsert = new Site();
      toBeInsert.name = site.name;
      toBeInsert.client = client as Client;
      toBeInsert.label = site.label;
      toBeInsert.address = site.address;
      toBeInsert.lat = site.lat;
      toBeInsert.lng = site.lng;
      toBeInsert.hasSolar = site.hasSolar;
      toBeInsert.solcastResourceId = site.solcastResourceId;
      toBeInsert.region = site.region;
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

  async getSiteDetails(
    client: string,
    siteName: string,
  ): Promise<ISite | null> {
    return this.siteRepo.findOne({
      name: siteName,
      client: {
        name: client,
      },
    });
  }

  async getSites(clientName: string, query: any): Promise<Array<ISite> | null> {
    return this.siteRepo.find(
      {
        client: { name: clientName },
      },
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
        populate: true,
      },
    );
  }

  public async updateSite(site: SiteDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(site); //unnecessary

    const toBeUpdate = (await this.getSiteDetail(site.name)) as ISite;

    if (message.length !== 0) {
      return {
        success: false,
        message,
      };
    }

    toBeUpdate.name = site.name;
    toBeUpdate.label = site.label;
    toBeUpdate.address = site.address;
    toBeUpdate.lat = site.lat;
    toBeUpdate.lng = site.lng;
    toBeUpdate.hasSolar = site.hasSolar;
    toBeUpdate.solcastResourceId = site.solcastResourceId;
    toBeUpdate.region = site.region;
    toBeUpdate.client = site.client;
    await this.em.persistAndFlush(toBeUpdate);
    return {
      success: true,
    };
  }
}
