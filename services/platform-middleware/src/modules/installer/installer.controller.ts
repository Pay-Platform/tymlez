import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@tymlez/backend-libs';

import type {
  IAddInstallerResult,
  IInstaller,
  IQueryInstaller,
  ISummary,
  IValidatedUser,
} from '@tymlez/platform-api-interfaces';
import { InstallerService } from './installer.service';
import { InstallerDTO } from './dto/installer.dto';

@Controller('installer')
@UseGuards(JwtAuthGuard)
export class InstallerController {
  constructor(private installerService: InstallerService) {}

  @Get()
  async getAll(@Query() query: any): Promise<IQueryInstaller> {
    return await this.installerService.getAll(query);
  }

  @Post()
  async AddInstaller(
    @Body() installer: InstallerDTO,
    @Req() req: Request,
  ): Promise<IAddInstallerResult> {
    const currentUser = req.user as IValidatedUser;
    const data = await this.installerService.addInstaller(
      installer,
      currentUser.id,
    );

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }

  @Get('/summary')
  async getSummary(): Promise<ISummary> {
    const data = await this.installerService.getSummary();
    return data;
  }

  @Get('/:id')
  async GetInstallerById(@Param() id: string): Promise<IInstaller> {
    const data = this.installerService.getInstallerById(id);
    return data;
  }

  @Put('/:id')
  async UpdateInstaller(
    @Body() installer: IInstaller,
  ): Promise<IAddInstallerResult> {
    const data = await this.installerService.updateInstaller(installer);

    if (data.message === null || data.message === undefined) {
      return { success: true };
    }

    return {
      success: false,
      message: data.message,
    };
  }
}
