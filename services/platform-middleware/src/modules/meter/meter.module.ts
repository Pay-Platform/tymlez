import { Module } from '@nestjs/common';
import { MeterController } from './meter.controller';
import { MeterService } from './meter.service';
import { QdbMeterDataProvider } from './meterData/QdbMeterDataProvider';
import { MeterQdbModule } from '../meter-qdb/meter-qdb.module';
import { MeterInfoModule } from '../meter-info/meter-info.module';
import { GuardianVerificationProvider } from './verification/GuardianVerificationProvider';

@Module({
  controllers: [MeterController],
  providers: [
    {
      provide: 'IMeterDataProvider',
      useClass: QdbMeterDataProvider,
    },
    {
      provide: 'IVerificationProvider',
      useClass: GuardianVerificationProvider,
    },
    MeterService,
  ],
  imports: [MeterQdbModule, MeterInfoModule],
})
export class MeterModule {}
