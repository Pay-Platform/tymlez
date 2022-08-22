import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@tymlez/backend-libs';
import type { IVerification } from '@tymlez/platform-api-interfaces';
import { DashboardService } from './dashboard.service';
import type {
  IDashboadBlockSummary,
  IUonDashboard,
  ISiteData,
  ICarbonReport,
  ICarbonAudit,
} from './interfaces';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  getDashboardOverview(
    @Headers('Authorization') authorizationHeader: string,
  ): Promise<IUonDashboard> {
    return this.dashboardService.getDashboardOverview({
      authorizationHeader,
    });
  }

  @Get('/carbon')
  getTotalCarbon(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getTotalCarbon();
  }

  @Get('/diesel')
  getCarbonDiesel(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getCarbonDiesel();
  }

  @Get('/co2')
  getKgCo2(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getKgCo2();
  }

  @Get('/water')
  getTotalWaterPumped(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getTotalWaterPumped();
  }

  @Get('/energy')
  availableStoredEnergy(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.availableStoredEnergy();
  }

  @Get('/energy-generation')
  getGreenEnergyGeneration(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getGreenEnergyGeneration();
  }

  @Get('/fossil-generation')
  getFossilGeneration(): Promise<IDashboadBlockSummary> {
    return this.dashboardService.getFossilGeneration();
  }

  @Get('/site')
  getSiteData(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<ISiteData> {
    return this.dashboardService.getSiteData(from, to);
  }

  @Get('/verification')
  getVerification(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('mocked', ParseBoolPipe) mocked: boolean,
  ): Promise<IVerification> {
    if (mocked) {
      return this.dashboardService.getMockedVerification();
    }
    return this.dashboardService.getVerification(page, pageSize);
  }

  @Get('/carbon-report')
  getCarbonReport(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<ICarbonReport> {
    return this.dashboardService.getCarbonReport(from, to);
  }

  @Get('/carbon-audit')
  getCarbonAudit(): Promise<ICarbonAudit[]> {
    return this.dashboardService.getCarbonAudit();
  }
}
