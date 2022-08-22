import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackAndTraceService } from './track-and-trace.service';
import { TrackAndTraceController } from './track-and-trace.controller';
import {
  ProcessedMrv,
  ProcessedMrvSchema,
} from '../../schemas/processed-mrv.schema';
import {
  DeviceConfig,
  DeviceConfigSchema,
} from '../../schemas/device-config.schema';
import {
  PolicyPackage,
  PolicyPackageSchema,
} from '../../schemas/policy-package.schema';
import { createGlobalVCDocumentHelper } from './documents/vc-document-loader';

@Module({
  controllers: [TrackAndTraceController],
  providers: [
    TrackAndTraceService,
    {
      provide: 'VCDocumentLoaderName',
      useValue: createGlobalVCDocumentHelper(),
    },
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessedMrv.name,
        schema: ProcessedMrvSchema,
      },
      {
        name: DeviceConfig.name,
        schema: DeviceConfigSchema,
      },
      {
        name: PolicyPackage.name,
        schema: PolicyPackageSchema,
      },
    ]),
  ],
  exports: [],
})
export class TrackAndTraceModule {}
