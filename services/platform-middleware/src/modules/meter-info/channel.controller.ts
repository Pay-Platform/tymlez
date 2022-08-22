import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@tymlez/backend-libs';
import type {
  IAddQueryResult,
  IChannel,
  IQueryChannel,
} from '@tymlez/platform-api-interfaces';
import assert from 'assert';
import type { Request } from 'express';
import { SiteService } from '../site/site.service';
import { ChannelService } from './channel.service';
import { CircuitService } from './circuit.service';
import type { ChannelDto } from './dto/channel.dto';
import { Circuit } from './entities/Circuit.entity';
import { Meter } from './entities/Meter.entity';
import { MeterInfoService } from './meter-info.service';

@Controller('channels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private siteService: SiteService,
    private circuitService: CircuitService,
    private meterService: MeterInfoService,
  ) {}

  @Get('/details/:channel')
  async getChannelDetail(
    @Param('channel') channelName: string,
  ): Promise<IChannel | null> {
    return this.channelService.getChannelDetail(channelName);
  }

  @Get('/:client')
  async getChannels(
    @Param('client') clientName: string,
    @Query() query: any,
  ): Promise<IChannel[]> {
    assert(
      await this.siteService.getClientDetail(clientName),
      `Cannot find client '${clientName}'`,
    );
    return this.channelService.getChannelsByClient(clientName, query);
  }

  @Get('get-channels-by-site/:site')
  async getChannelsBySite(
    @Param('site') siteName: string,
  ): Promise<IChannel[]> {
    assert(
      await this.siteService.getSiteDetail(siteName),
      `Site does not exist`,
    );
    return this.channelService.getChannelsBySite(siteName);
  }

  @Get()
  async getAllChannels(@Query() query: any): Promise<IQueryChannel> {
    return this.channelService.getAllChannels(query);
  }

  @Post()
  @Roles('admin')
  async addChannel(@Req() req: Request): Promise<IAddQueryResult> {
    const channel = req.body as ChannelDto;
    channel.circuit = (await this.circuitService.getCircuitDetail(
      req.body.circuit,
    )) as Circuit;
    if (channel.circuit === null) {
      return {
        success: false,
        message: ['Circuit should be selected'],
      };
    }

    channel.meter = (await this.meterService.getMeterDetail(
      req.body.meter,
    )) as Meter;
    if (channel.meter === null) {
      return {
        success: false,
        message: ['Meter should be selected'],
      };
    }

    const data = await this.channelService.addChannel(channel);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }

  // @Put('/:channelName')
  // async UpdateMeter(@Req() req: Request): Promise<IAddQueryResult> {
  //   const channel = req.body as ChannelDto;
  //   const data = await this.channelService.updateChannel(channel);

  //   if (data.message === null || data.message === undefined) {
  //     return { success: true };
  //   }

  //   return {
  //     success: false,
  //     message: data.message,
  //   };
  // }
}
