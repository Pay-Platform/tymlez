import { Module } from '@nestjs/common';
import { MeterQdbService } from './meter-qdb.service';

@Module({
  providers: [MeterQdbService],
  exports: [MeterQdbService],
})
export class MeterQdbModule {}
