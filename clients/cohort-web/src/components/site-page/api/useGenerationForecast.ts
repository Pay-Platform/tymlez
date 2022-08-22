import axios from 'axios';
import { useQuery } from 'react-query';
import _ from 'lodash';
import type {
  IForecastType,
  IGenerationForecastRecordSeries,
  ISourceType,
} from '@tymlez/platform-api-interfaces';
import SeriesColors from '../../../api/SeriesColors';
import { formatMillisecondsWithTimeZone } from '../../../utils/date';

export function useGenerationForecast(
  defaultSiteName: string | undefined,
  dataInterval: IForecastType = 'hourly',
  dataType: 'forecast' | 'history' = 'forecast',
) {
  return useQuery(
    ['generation-forecast', dataInterval, defaultSiteName],
    async () => {
      if (!defaultSiteName) {
        return [] as Array<{
          name: string;
          data: any;
          from: Date;
          to: Date;
          color: string;
        }>;
      }
      const { data } = await axios.get<IGenerationForecastRecordSeries>(
        `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/generation/${defaultSiteName}/${dataType}/${dataInterval}`,
        //
      );

      return toGenerationForecast(data);
    },
    { refetchOnWindowFocus: false },
  );
}

function toGenerationForecast(
  siteGenerationForecast: IGenerationForecastRecordSeries,
) {
  const siteGenerationForecastPerSourceType = groupBySourceType(
    siteGenerationForecast,
  );

  const generationForecast = siteGenerationForecastPerSourceType.map((item) => {
    const data = item.series.map((record) => {
      return {
        x: new Date(formatMillisecondsWithTimeZone(record.periodEnd)),
        y: _.round(record.estimated, 3),
      };
    });

    return {
      name: item.sourceType,
      data,
      from: data[0].x,
      to: data[data.length - 1].x,
      color:
        SeriesColors.get(item.sourceType) ||
        Array.from(SeriesColors.values())[0],
    };
  });
  return generationForecast;
}

function groupBySourceType(
  siteGenerationForecast: IGenerationForecastRecordSeries,
  sources?: Array<ISourceType>,
): IGenerationForecastRecordSeries {
  const newSources = sources ? [...sources] : [];
  if (!sources) {
    for (const item of siteGenerationForecast) {
      if (item.series.length !== 0) {
        if (newSources && !newSources.includes(item.sourceType)) {
          newSources.push(item.sourceType);
        }
      }
    }
  }
  return newSources.map((sourceType: ISourceType) => {
    const onlySourceSeries = siteGenerationForecast.filter(
      (x) => x.sourceType === sourceType,
    );

    if (onlySourceSeries.length === 1) {
      return onlySourceSeries[0];
    }

    const singleSeriesGroupedBySourceType = onlySourceSeries[0].series;
    for (let i = 1; i < onlySourceSeries.length; i++) {
      for (const oneRecord of onlySourceSeries[i].series) {
        singleSeriesGroupedBySourceType.filter(
          (sr) => sr.periodEnd === oneRecord.periodEnd,
        )[0].estimated += oneRecord.estimated;
      }
    }

    return {
      sourceType,
      series: singleSeriesGroupedBySourceType,
    };
  });
}
