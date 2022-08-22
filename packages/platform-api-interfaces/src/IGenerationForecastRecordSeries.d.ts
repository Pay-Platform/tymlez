import type { IGenerationForecastRecord, ISourceType } from '..';

export type IGenerationForecastRecordSeries = Array<{
  sourceType: ISourceType;
  series: Array<IGenerationForecastRecord>;
}>;
