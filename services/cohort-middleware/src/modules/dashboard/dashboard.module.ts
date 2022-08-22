import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CircuitTabController } from './circuitTab.controller';
import { CircuitService } from './circuit.service';
import { MeterServiceFactory } from './libs/meter.service';
import { MeterInfoServiceFactory } from './libs/meter-info.service';

@Module({
  controllers: [DashboardController, CircuitTabController],
  providers: [
    DashboardService,
    CircuitService,
    MeterServiceFactory,
    MeterInfoServiceFactory,
  ],
})
export class DashboardModule {}
