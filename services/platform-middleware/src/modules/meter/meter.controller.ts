import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, HandleDateParameter } from '@tymlez/backend-libs';
import type {
  MeterId,
  ITimestampMsec,
  IVerification,
  VerificationPeriod,
} from '@tymlez/platform-api-interfaces';
import { ApiQuery } from '@nestjs/swagger';
import type { IMeterData } from '@tymlez/backend-libs';
import { MeterService } from './meter.service';

@Controller('meters')
export class MeterController {
  constructor(private meterService: MeterService) {}

  @ApiQuery({ name: 'meterIds' })
  @ApiQuery({ name: 'from' })
  @ApiQuery({ name: 'to' })
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @Query('meterIds', new ParseArrayPipe({ items: String, separator: ',' }))
    meterIds: MeterId[],
    @Query('from', HandleDateParameter) from: Date,
    @Query('to', HandleDateParameter) to: Date,
  ): Promise<IMeterData> {
    return await this.meterService.getHistory(meterIds, from, to);
  }

  @ApiQuery({ name: 'meterIds' })
  @ApiQuery({ name: 'since', required: false })
  @UseGuards(JwtAuthGuard)
  @Get('realtime')
  async getRealtime(
    @Query('meterIds', new ParseArrayPipe({ items: String, separator: ',' }))
    meterIds: MeterId[],
    @Query('limit', ParseIntPipe) limit: number,
    @Query('since', new DefaultValuePipe(0), ParseIntPipe)
    since?: ITimestampMsec,
  ): Promise<IMeterData> {
    return await this.meterService.getRealtime(meterIds, limit, since);
  }

  @ApiQuery({ name: 'siteName' })
  @ApiQuery({ name: 'period' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @UseGuards(JwtAuthGuard)
  @Get('verification')
  async getVerification(
    @Query('siteName') siteName: string,
    @Query('period') period: VerificationPeriod,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<IVerification> {
    return await this.meterService.getVerification(
      siteName,
      period,
      page,
      pageSize,
    );
  }
}
