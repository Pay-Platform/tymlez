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
import {
  ICircuitMap,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@tymlez/backend-libs';
import type { Request } from 'express';
import type {
  IAddQueryResult,
  IChannel,
  IMeter,
  IQueryMeter,
  IValidatedUser,
  UUID,
} from '@tymlez/platform-api-interfaces';
import { ApiQuery } from '@nestjs/swagger';
import assert from 'assert';
import { MeterInfoService } from './meter-info.service';
import { SiteService } from '../site/site.service';
import type { MeterDto } from './dto/meter.dto';
import { Site } from '../site/entities/Site.entity';

@Controller('meter-info')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeterInfoController {
  constructor(
    private meterInfoService: MeterInfoService,
    private siteService: SiteService,
  ) {}

  @ApiQuery({ name: 'siteName' })
  @Get('circuits')
  async getCircuitMapBySite(
    @Req() req: Request,
    @Query('siteName') siteName: string,
  ): Promise<ICircuitMap> {
    const user = req.user as IValidatedUser;

    assert(
      await this.siteService.getClientDetail(user.clientName),
      `Cannot find client '${user.clientName}'`,
    );
    assert(
      await this.siteService.getSiteDetail(siteName),
      `Site does not exist`,
    );
    return await this.meterInfoService.getCircuitMapBySite(siteName);
  }

  @Get('meters-by-site/:siteName')
  async getAllChannelsBySite(
    @Req() req: Request,
    @Param('siteName') siteName: UUID,
  ): Promise<(IMeter & { channels: IChannel[] })[]> {
    const user = req.user as IValidatedUser;

    const client = await this.siteService.getClientDetail(user.clientName);
    assert(client, `Cannot find client '${user.clientName}'`);

    // Should validate if site is belong to this client unless the user is admin

    return this.meterInfoService.getMetersChannelsBySite(siteName);
  }

  @Get('meters')
  async getAllChannelsByClient(
    @Req() req: Request,
  ): Promise<(IMeter & { channels: IChannel[] })[]> {
    const user = req.user as IValidatedUser;

    const client = await this.siteService.getClientDetail(user.clientName);
    assert(client, `Cannot find client '${user.clientName}'`);

    return this.meterInfoService.getMetersByClient(user.clientName);
  }

  @Get('get-main-meter-by-site/:site')
  async getMainMeterDetail(
    @Param('site') siteName: string,
  ): Promise<IMeter | null> {
    return this.meterInfoService.getMainMeterBySite(siteName);
  }

  @Get('/details/:meter')
  async getMeterDetail(
    @Param('meter') meterName: string,
  ): Promise<IMeter | null> {
    return this.meterInfoService.getMeterDetail(meterName);
  }

  @Get('get-meters-by-site/:site')
  async getMetersBySite(@Param('site') siteName: string): Promise<IMeter[]> {
    assert(
      await this.siteService.getSiteDetail(siteName),
      `Site does not exist`,
    );
    return this.meterInfoService.getMetersBySite(siteName);
  }

  @Get('/:client')
  async getMeters(@Param('client') clientName: string): Promise<IMeter[]> {
    assert(
      await this.siteService.getClientDetail(clientName),
      `Cannot find client '${clientName}'`,
    );

    return this.meterInfoService.getMetersByClient(clientName);
  }

  @Get()
  async getAllMeters(@Query() query: any): Promise<IQueryMeter> {
    return this.meterInfoService.getAllMeters(query);
  }

  @Post()
  @Roles('admin')
  async addMeter(@Req() req: Request): Promise<IAddQueryResult> {
    const meter = req.body as MeterDto;
    meter.site = (await this.siteService.getSiteDetail(req.body.site)) as Site;
    if (meter.site === null) {
      return {
        success: false,
        message: ['Site should be selected'],
      };
    }
    const data = await this.meterInfoService.addMeter(meter);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }

  @Put('/:meterName')
  async UpdateMeter(@Req() req: Request): Promise<IAddQueryResult> {
    const meter = req.body as MeterDto;
    const data = await this.meterInfoService.updateMeter(meter);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }
}
