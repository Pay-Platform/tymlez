import { useState } from 'react';
import type { IConsumptionRealtimeRecord } from '@tymlez/platform-api-interfaces/src/demo/prosumer';

import { stringToColor } from '../utils/style';
import type { ChartSeries } from './ChartSeries';

export const toGroupedByConsumerType = (
  records: IConsumptionRealtimeRecord[],
): { [key: string]: IConsumptionRealtimeRecord[] } => {
  if (records.length < 1) {
    return {};
  }
  records.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
  const grouped: { [key: string]: IConsumptionRealtimeRecord[] } =
    records.reduce(
      (acc: { [key: string]: IConsumptionRealtimeRecord[] }, curr) => {
        if (!acc[curr.consumerType]) {
          acc[curr.consumerType] = [];
        }
        acc[curr.consumerType].push(curr);
        return acc;
      },
      {},
    );
  return grouped;
};

export const toGroupedBySourceTypeAndOrigin = (
  records: IConsumptionRealtimeRecord[],
): { [key: string]: IConsumptionRealtimeRecord[] } => {
  if (records.length < 1) {
    return {};
  }
  records.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
  const grouped: { [key: string]: IConsumptionRealtimeRecord[] } =
    records.reduce(
      (acc: { [key: string]: IConsumptionRealtimeRecord[] }, curr) => {
        const key = `${curr.sourceType} (${curr.origin})`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      },
      {},
    );
  return grouped;
};

export const toCalculatedSeriesByDates = (
  groupedRecords: { [key: string]: IConsumptionRealtimeRecord[] },
  dates: number[],
  timeout: number,
): ChartSeries[] => {
  const series = [];
  for (const ct in groupedRecords) {
    if (Object.prototype.hasOwnProperty.call(groupedRecords, ct)) {
      const data: { x: Date; y: number }[] = [];
      const values = groupedRecords[ct];
      dates.reduce((prevDate, curDate) => {
        const valueSum = values
          .filter((v) => v.timestamp > prevDate && v.timestamp <= curDate)
          .reduce((sum, cur) => cur.value + sum, 0);
        if (valueSum > 0) {
          data.push({
            x: new Date(curDate),
            y: valueSum,
          });
        }
        return curDate;
      }, dates[0] - timeout);
      series.push({
        name: ct,
        color: stringToColor(ct),
        data,
      });
    }
  }
  return series;
};

export const useRealtimeConsumption = (
  siteName: string | undefined,
  selectedTimeout: number,
) => {
  console.log('useRealtimeConsumption', siteName, selectedTimeout);
  const [realtimConsumption] = useState([]);
  return realtimConsumption;
};

export const useForecastConsumption = (
  siteName: string | undefined,
  selectedTimeout: number,
) => {
  console.log('useForecastConsumption', siteName, selectedTimeout);
  const [forecastConsumption] = useState([]);
  return forecastConsumption;
};

export const useConsumption = (
  siteName: string | undefined,
  from: Date,
  to: Date,
) => {
  console.log('useConsumption', siteName, from, to);
  const [consumption] = useState([]);
  return consumption;
};
