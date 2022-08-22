import type {
  IEnergyTimeSeries,
  IEnergyTimeSeriesPoint,
} from '@tymlez/platform-api-interfaces';
import { useMemo } from 'react';
import _ from 'lodash';
import { stringToColor } from '../utils/style';
import { formatMillisecondsWithTimeZone } from '../utils/date';

export type ColorMap = Record<string, string>;

export function energySeriesToChart(
  energySeries?: IEnergyTimeSeries[],
  colorMap?: ColorMap,
) {
  // console.log("++++", siteInfo)
  if (!energySeries) {
    return [];
  }
  return energySeries.map((series) => ({
    ...series,
    color: colorMap
      ? colorMap[series.name] ?? stringToColor(series.name)
      : stringToColor(series.name),
    data: series.data.map((item: IEnergyTimeSeriesPoint) => ({
      x: formatMillisecondsWithTimeZone(item.timestamp),
      y: _.round(item.value, 3),
    })),
  }));
}
export function useChartSeries(energySeries?: IEnergyTimeSeries[]) {
  return useMemo(() => energySeriesToChart(energySeries), [energySeries]);
}
