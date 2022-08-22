import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import type {
  IConsumptionHistoryRecord,
  IConsumptionRealtimeRecord,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { logger } from '@tymlez/backend-libs';
import { ConsumptionService } from './consumption.service';

@Controller('consumption')
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @ApiParam({ name: 'meterId' })
  @ApiQuery({ name: 'since', required: false })
  @Get('/realtime')
  realtime(
    @Query('meterId') meterId: string,
    @Query('columns', new ParseArrayPipe({ items: String, separator: ',' }))
    columns: string[],
    @Query('since') since?: ITimestampMsec,
  ): Promise<IConsumptionRealtimeRecord[]> {
    logger.info({ meterId, columns, since }, 'realtime');
    return this.consumptionService.realtime(meterId, columns, Number(since));
  }

  @ApiParam({ name: 'siteName' })
  @ApiParam({ name: 'from' })
  @ApiParam({ name: 'to' })
  @Get(':siteName/history/:from/:to')
  history(
    @Param('siteName') siteName: string,
    @Param('from', ParseIntPipe) from: ITimestampMsec,
    @Param('to', ParseIntPipe) to: ITimestampMsec,
    @Query('meterId') meterId: string,
    @Query('columns', new ParseArrayPipe({ items: String, separator: ',' }))
    columns: string[],
  ): Promise<IConsumptionHistoryRecord[]> {
    logger.info({ meterId, columns }, 'consumption controller::: history');
    return this.consumptionService.history(
      siteName,
      from,
      to,
      meterId,
      columns,
    );
  }
}
