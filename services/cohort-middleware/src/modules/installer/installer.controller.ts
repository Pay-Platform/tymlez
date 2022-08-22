import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Headers,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '@tymlez/backend-libs';
import type {
  IAddInstallerResult,
  IInstaller,
  IQueryInstaller,
  ISummary,
} from '@tymlez/platform-api-interfaces';
import { InstallerService } from './installer.service';
import { InstallerDTO } from './dto/installer.dto';

@Controller('installer')
export class InstallerController {
  constructor(private installerService: InstallerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllInstaller(
    @Headers('Authorization') authorizationHeader: string,
    @Query() query: any,
  ): Promise<IQueryInstaller> {
    const data = await this.installerService.getAll(authorizationHeader, query);
    return {
      total: data.total,
      installers: data.installers.map(
        (item) =>
          ({
            id: item.id,
            name: item.name,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
          } as IInstaller),
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/summary')
  async getInstallerSummary(
    @Headers('Authorization') authorizationHeader: string,
    @Query() query: any,
  ): Promise<ISummary> {
    return await this.installerService.getSummary(authorizationHeader, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async postInstaller(
    @Body() installer: InstallerDTO,
    @Headers('Authorization') authorizationHeader: string,
  ): Promise<IAddInstallerResult> {
    const result = await this.installerService.addIntaller(
      installer,
      authorizationHeader,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getInstallerById(
    @Headers('Authorization') authorizationHeader: string,
    @Param('id') id: string,
  ): Promise<InstallerDTO> {
    return await this.installerService.getIntallerById(id, authorizationHeader);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateInstaller(
    @Body() installer: InstallerDTO,
    @Headers('Authorization') authorizationHeader: string,
  ): Promise<IAddInstallerResult> {
    const result = await this.installerService.updateInstaller(
      installer,
      authorizationHeader,
    );
    return result;
  }
}
