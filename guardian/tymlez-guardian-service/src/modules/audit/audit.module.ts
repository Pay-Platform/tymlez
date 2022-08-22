import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import {
  DeviceConfig,
  DeviceConfigSchema,
} from '../../schemas/device-config.schema';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports: [
    MongooseModule.forFeature([
      {
        name: DeviceConfig.name,
        schema: DeviceConfigSchema,
      },
    ]),
  ],
})
export class AuditModule {}
