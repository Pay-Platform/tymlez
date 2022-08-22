import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@tymlez/backend-libs';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';

@Controller('debug')
@UseGuards(JwtAuthGuard)
export class DebugController {
  constructor(private meterQdbService: MeterQdbService) {}

  @Get('telemetry-config')
  async getTelemetryConfig(): Promise<any[]> {
    return this.meterQdbService.getTelemetryConfig();
  }

  @Get('telemetries')
  async getTelemetries(): Promise<any[]> {
    return this.meterQdbService.getTelemetries();
  }
}
