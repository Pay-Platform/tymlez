import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard, HandleDateParameter } from '@tymlez/backend-libs';
import type {
  ICohortCircuitHistory,
  ICohortCircuitRealtime,
} from '@tymlez/cohort-api-interfaces';
import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';
import { CircuitService } from './circuit.service';

@Controller('dashboard/circuit')
export class CircuitTabController {
  constructor(private circuitService: CircuitService) {}

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getCircuitHistory(
    @Headers('Authorization') authorizationHeader: string,
    @Query('siteName') siteName: string,
    @Query('from', HandleDateParameter) from: Date,
    @Query('to', HandleDateParameter) to: Date,
  ): Promise<ICohortCircuitHistory> {
    return await this.circuitService.getHistory(
      { authorizationHeader },
      siteName,
      from,
      to,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('realtime')
  async getRealtime(
    @Headers('Authorization') authorizationHeader: string,
    @Query('siteName') siteName: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('since') since?: ITimestampMsec,
  ): Promise<ICohortCircuitRealtime> {
    return await this.circuitService.getRealtime(
      { authorizationHeader },
      siteName,
      limit,
      since,
    );
  }
}
