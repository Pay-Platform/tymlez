import { Module } from '@nestjs/common';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';
import { ConsumptionController } from './consumption.controller';
import { ConsumptionService } from './consumption.service';
import { ConsumptionRealtimeService } from './fakeProviders/fakeConsumption.realtime';

@Module({
  controllers: [ConsumptionController],
  providers: [ConsumptionService, ConsumptionRealtimeService, MeterQdbService],
})
export class ConsumptionModule {}
