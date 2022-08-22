import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { DeviceConfig } from '../../schemas/device-config.schema';
import type { ProcessedMrv } from '../../schemas/processed-mrv.schema';
import type { DeviceRegisterDto } from './dto/device-register.dto';
import type { GenerateMvcDto } from './dto/generate-mrv.dto';
import type { InstallerRegisterDto } from './dto/installer-register.dto';
import { TrackAndTraceService } from './track-and-trace.service';

@Controller('track-and-trace')
export class TrackAndTraceController {
  constructor(private readonly trackAndTraceService: TrackAndTraceService) {}

  @Get('/list-devices/:policyTag')
  async listDeviceByPolicyTag(
    @Param('policyTag') policyTag: string,
  ): Promise<DeviceConfig[]> {
    return await this.trackAndTraceService.listDeviceByPolicyTag(policyTag);
  }

  @Get('/latest-mrv/:policyTag/:deviceId')
  async getLatestMrv(
    @Param('deviceId') deviceId: string,
    @Param('policyTag') policyTag: string,
  ): Promise<ProcessedMrv | null> {
    return await this.trackAndTraceService.getLatestMrv(policyTag, deviceId);
  }

  @Post('/generate-mrv')
  async generateMrv(@Body() mrv: GenerateMvcDto): Promise<ProcessedMrv> {
    return await this.trackAndTraceService.generateMrv(mrv);
  }

  @Post('/register-installer')
  async registerInstaller(
    @Body() installer: InstallerRegisterDto,
  ): Promise<any> {
    return await this.trackAndTraceService.registerInstaller(installer);
  }

  @Post('/add-device')
  async registerDevice(
    @Body() device: DeviceRegisterDto,
  ): Promise<DeviceConfig> {
    return await this.trackAndTraceService.registerDevice(device);
  }
}
