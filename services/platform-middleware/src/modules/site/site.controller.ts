import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@tymlez/backend-libs';
import type {
  IAddQueryResult,
  IQuerySite,
  ISite,
} from '@tymlez/platform-api-interfaces';
import assert from 'assert';
import type { Request } from 'express';
import { Client } from '../auth/entities/Client.entity';
import type { SiteDto } from './dto/site.dto';
import { SiteService } from './site.service';

@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Get()
  async getAllSites(@Query() query: any): Promise<IQuerySite> {
    return this.siteService.getAllSites(query);
  }

  // @Get('get-sites-by-client/:client')
  // async getSitesByClient(
  //   @Param('client') clientName: string,
  // ): Promise<ISite[] | null> {
  //   assert(
  //     await this.siteService.getClientDetail(clientName),
  //     `Cannot find client '${clientName}'`,
  //   );

  //   return this.siteService.getSitesByClient(clientName);
  // }

  @Get('/details/:site')
  async getSiteDetail(@Param('site') siteName: string): Promise<ISite | null> {
    return this.siteService.getSiteDetail(siteName);
  }

  @Get('/:client/:siteName')
  async getSiteDetails(
    @Param('client') clientName: string,
    @Param('siteName') siteName: string,
  ): Promise<ISite | null> {
    return this.siteService.getSiteDetails(clientName, siteName);
  }

  @Get('/:client')
  async getSites(
    @Param('client') clientName: string,
    @Query() query: any,
  ): Promise<Array<ISite> | null> {
    assert(
      await this.siteService.getClientDetail(clientName),
      `Cannot find client '${clientName}'`,
    );
    return this.siteService.getSites(clientName, query);
  }

  @Post()
  @Roles('admin')
  async addSite(@Req() req: Request): Promise<IAddQueryResult> {
    const site = req.body as SiteDto;

    site.client = (await this.siteService.getClientDetail(
      req.body.client,
    )) as Client;
    // assert(site.client, 'Client should be selected');
    if (site.client === null) {
      return {
        success: false,
        message: ['Client should be selected'],
      };
    }

    const data = await this.siteService.addSite(site);
    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }

  @Put('/:siteName')
  async UpdateSite(@Req() req: Request): Promise<IAddQueryResult> {
    const site = req.body as SiteDto;
    const data = await this.siteService.updateSite(site);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }
}
