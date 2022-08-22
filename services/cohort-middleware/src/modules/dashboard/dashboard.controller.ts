import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Query,
  Param,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@tymlez/backend-libs';
import type {
  IForecastType,
  IGenerationForecastRecord,
  IGenerationForecastRecordSeries,
  ITimestampMsec,
  UUID,
  ICarbonEmissionsRecord,
  ISiteEmissionTotal,
} from '@tymlez/platform-api-interfaces';
import type {
  ICohortConsumptionRecord,
  ICohortDashboard,
  ICohortSiteDetail,
} from '@tymlez/cohort-api-interfaces';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboardOverview(
    @Headers('Authorization') authorizationHeader: string,
  ): Promise<ICohortDashboard> {
    return this.dashboardService.getDashboardOverview({
      authorizationHeader,
    });
  }

  @ApiParam({ name: 'siteName' })
  @UseGuards(JwtAuthGuard)
  @Get('consumption/:siteName/realtime')
  getConsumptionRealtime(
    @Headers('X-Correlation-ID') correlationId: string,
    @Headers('Authorization') authorizationHeader: string,
    @Param('siteName')
    siteName: string,
    @Query('since') since: ITimestampMsec,
  ): Promise<ICohortConsumptionRecord[]> {
    return this.dashboardService.getConsumptionRealtime({
      correlationId,
      authorizationHeader,
      siteName,
      since,
    });
  }

  @ApiParam({ name: 'siteName' })
  @ApiParam({ name: 'from' })
  @ApiParam({ name: 'to' })
  @UseGuards(JwtAuthGuard)
  @Get('consumption/:siteName/history/:from/:to')
  getConsumptionHistory(
    @Headers('X-Correlation-ID') correlationId: string,
    @Headers('Authorization') authorizationHeader: string,
    @Param('siteName') siteName: string,
    @Param('from') from: ITimestampMsec,
    @Param('to') to: ITimestampMsec,
  ): Promise<ICohortConsumptionRecord[]> {
    return this.dashboardService.getConsumptionHistory({
      correlationId,
      authorizationHeader,
      siteName,
      from,
      to,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('generation/:siteName/forecast/:forecastType')
  getGenerationForecast(
    @Headers('Authorization') authorizationHeader: string,
    @Param('siteName')
    siteName: string,
    @Param('forecastType')
    forecastType: IForecastType,
    @Query('since') since: ITimestampMsec,
  ): Promise<IGenerationForecastRecordSeries> {
    return this.dashboardService.getGenerationForecast({
      authorizationHeader,
      siteName,
      since,
      forecastType,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('generation/:siteName/history/:forecastType')
  getGenerationHistory(
    @Headers('Authorization') authorizationHeader: string,
    @Param('siteName')
    siteName: string,
    @Param('forecastType')
    forecastType: IForecastType,
    @Param('from') from: ITimestampMsec,
    @Param('to') to: ITimestampMsec,
  ): Promise<IGenerationForecastRecordSeries> {
    return this.dashboardService.getGenerationHistory({
      authorizationHeader,
      siteName,
      from,
      to,
      forecastType,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('generation/:siteName/forecast24h')
  getGenerationForecast24h(
    @Headers('Authorization') authorizationHeader: string,
    @Param('siteName')
    siteName: string,
  ): Promise<IGenerationForecastRecord> {
    return this.dashboardService.getGenerationForecast24h({
      authorizationHeader,
      siteName,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('site-detail/:siteName')
  getSiteDetail(
    @Param('siteName') siteName: string,
    @Headers('Authorization') authorizationHeader: string,
    @Headers('X-Correlation-ID') correlationId: string,
  ): Promise<ICohortSiteDetail> {
    return this.dashboardService.getSiteDetail({
      siteName,
      authorizationHeader,
      correlationId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('default-site-name')
  getDefaultSiteName(): UUID {
    return this.dashboardService.getDefaultSiteName();
  }

  @UseGuards(JwtAuthGuard)
  @Get('carbon/realtime')
  getCarbonEmissionsRealtime(
    @Query('siteName') siteName: string,
    @Query('since') since: ITimestampMsec,
    @Headers('Authorization') authorizationHeader: string,
    @Headers('X-Correlation-ID') correlationId: string,
  ): Promise<ICarbonEmissionsRecord[]> {
    return this.dashboardService.getCarbonEmissionsRealtime({
      authorizationHeader,
      correlationId,
      siteName,
      since,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('carbon/history')
  getCarbonEmissionsHistory(
    @Query('siteName') siteName: string,
    @Query('from') from: ITimestampMsec,
    @Query('to') to: ITimestampMsec,
    @Headers('Authorization') authorizationHeader: string,
    @Headers('X-Correlation-ID') correlationId: string,
  ): Promise<ICarbonEmissionsRecord[]> {
    return this.dashboardService.getCarbonEmissionsHistory({
      authorizationHeader,
      correlationId,
      siteName,
      from,
      to,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('carbon/total')
  getCarbonEmissionsTotal(
    @Query('siteName') siteName: string,
    @Headers('Authorization') authorizationHeader: string,
    @Headers('X-Correlation-ID') correlationId: string,
  ): Promise<ISiteEmissionTotal> {
    return this.dashboardService.getCarbonEmissionsTotal({
      authorizationHeader,
      correlationId,
      siteName,
    });
  }
}
