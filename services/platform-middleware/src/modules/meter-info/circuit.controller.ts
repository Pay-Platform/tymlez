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
  ICircuit,
  IQueryCircuit,
} from '@tymlez/platform-api-interfaces';
import type { Request } from 'express';
import assert from 'assert';
import type { CircuitDto } from './dto/circuit.dto';
import { CircuitService } from './circuit.service';
import { MeterInfoService } from './meter-info.service';
import { SiteService } from '../site/site.service';
import { Meter } from './entities/Meter.entity';

@Controller('circuits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CircuitController {
  constructor(
    private circuitService: CircuitService,
    private meterService: MeterInfoService,
    private siteService: SiteService,
  ) {}

  @Get('get-circuits-by-meter/:meter')
  async getCircuitsByMeter(
    @Param('meter') meterName: string,
  ): Promise<ICircuit[]> {
    assert(
      await this.meterService.getMeterDetail(meterName),
      `Meter does not exist`,
    );
    return this.circuitService.getCircuitsByMeter(meterName);
  }

  @Get('get-circuits-by-site/:site')
  async getCircuitsBySite(
    @Param('site') siteName: string,
  ): Promise<ICircuit[]> {
    assert(
      await this.siteService.getSiteDetail(siteName),
      `Site does not exist`,
    );
    return this.circuitService.getCircuitsBySite(siteName);
  }

  @Get('/:client')
  async getCircuits(@Param('client') siteName: string): Promise<ICircuit[]> {
    assert(
      await this.siteService.getSiteDetail(siteName),
      `Site does not exist`,
    );
    return this.circuitService.getCircuitsBySite(siteName);
  }

  @Get('/details/:circuit')
  async getCircuitDetail(
    @Param('circuit') circuitName: string,
  ): Promise<ICircuit | null> {
    return this.circuitService.getCircuitDetail(circuitName);
  }

  @Get()
  async getAllCircuits(@Query() query: any): Promise<IQueryCircuit> {
    return this.circuitService.getAllCircuits(query);
  }

  @Post()
  @Roles('admin')
  async addCircuit(@Req() req: Request): Promise<IAddQueryResult> {
    const circuit = req.body as CircuitDto;
    circuit.meter = (await this.meterService.getMeterDetail(
      req.body.meter,
    )) as Meter;
    if (circuit.meter === null) {
      return {
        success: false,
        message: ['Meter should be selected'],
      };
    }

    const data = await this.circuitService.addCircuit(circuit);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }

  @Put('/:circuitName')
  async UpdateMeter(@Req() req: Request): Promise<IAddQueryResult> {
    const circuit = req.body as CircuitDto;
    const data = await this.circuitService.updateCircuit(circuit);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }
}
