import { Controller, Get, Param } from '@nestjs/common';

import type {
  IForecastType,
  IGenerationForecastRecordSeries,
  IGenerationForecastRecord,
} from '@tymlez/platform-api-interfaces';
import { endOfDay, subDays } from 'date-fns';
import { GenerationService } from './generation.service';

@Controller('generation')
export class GenerationController {
  constructor(private generationService: GenerationService) {}

  // hourly/daily/monthly one source
  @Get(':siteName/forecast/:forecastType/solar')
  forecast(
    @Param('siteName') siteName: string,
    @Param('forecastType') forecastType: IForecastType,
  ): Promise<IGenerationForecastRecordSeries> {
    return this.generationService.forecastSolarGeneration(
      siteName,
      forecastType,
      new Date(),
    );
  }

  @Get(':siteName/history/:forecastType/solar')
  history(
    @Param('siteName') siteName: string,
    @Param('forecastType') forecastType: IForecastType,
  ): Promise<IGenerationForecastRecordSeries> {
    const now = new Date();
    return this.generationService.forecastSolarGeneration(
      siteName,
      forecastType,
      subDays(now, 7),
      endOfDay(subDays(now, 1)),
    );
  }

  @Get(':siteName/forecast/solar/24h')
  forecast24h(
    @Param('siteName') siteName: string,
  ): Promise<IGenerationForecastRecord> {
    return this.generationService.forecastSolarGeneration24h(
      siteName,
      new Date(),
    );
  }
}
