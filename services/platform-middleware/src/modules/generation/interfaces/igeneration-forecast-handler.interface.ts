import type {
  IForecastType,
  IGenerationForecastRecordSeries,
} from '@tymlez/platform-api-interfaces';

export interface IGenerationForecastHandler {
  forecastSolarGeneration(
    siteName: string,
    forecastType: IForecastType,
    from: Date,
    to?: Date,
  ): Promise<IGenerationForecastRecordSeries>;
}
