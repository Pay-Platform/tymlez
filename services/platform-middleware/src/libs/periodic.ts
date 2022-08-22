/**
 * Routines to generate fake/test time series data.
 *
 * Usage:
 * const series = generatePeriodicSeries(
 *  generateTimeline({ count: 30, periodType: PeriodType.Per5sec }),
 *  PeriodType.Per5sec,
 * );
 */

import { add } from 'date-fns';
import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';

export enum PeriodType {
  Per5sec = '5sec',
  Per5min = '5min',
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

const periods: Record<PeriodType, ITimestampMsec> = {
  [PeriodType.Per5sec]: 30 * 5 * 1000,
  [PeriodType.Per5min]: 30 * 5 * 60 * 1000,
  [PeriodType.Hourly]: 30 * 60 * 60 * 1000,
  [PeriodType.Daily]: 30 * 24 * 60 * 60 * 1000,
  [PeriodType.Weekly]: 30 * 7 * 24 * 60 * 60 * 1000,
  [PeriodType.Monthly]: 30 * 30 * 24 * 60 * 60 * 1000,
};

const forwardDurations: Record<PeriodType, Duration> = {
  [PeriodType.Per5sec]: { seconds: 5 },
  [PeriodType.Per5min]: { minutes: 5 },
  [PeriodType.Hourly]: { hours: 1 },
  [PeriodType.Daily]: { days: 1 },
  [PeriodType.Weekly]: { days: 7 },
  [PeriodType.Monthly]: { months: 1 },
};
const reverseDurations: Record<PeriodType, Duration> = {
  [PeriodType.Per5sec]: { seconds: -5 },
  [PeriodType.Per5min]: { minutes: -5 },
  [PeriodType.Hourly]: { hours: -1 },
  [PeriodType.Daily]: { days: -1 },
  [PeriodType.Weekly]: { days: -7 },
  [PeriodType.Monthly]: { months: -1 },
};

export interface GenerateTimelineOptions {
  count: number;
  periodType: PeriodType;
  start?: ITimestampMsec | Date;
  isReverse?: boolean;
}

export function generateTimeline(
  options: GenerateTimelineOptions,
): Array<Date> {
  const duration = options.isReverse
    ? reverseDurations[options.periodType]
    : forwardDurations[options.periodType];
  let date: Date;
  if (!options.start) {
    date = new Date();
  } else if (typeof options.start === 'number') {
    date = new Date(options.start);
  } else {
    date = options.start as Date;
  }
  const timeline = Array(options.count)
    .fill(0)
    .map(() => {
      const value = date;
      date = add(date, duration as Duration);
      return value;
    });
  return options.isReverse ? timeline.reverse() : timeline;
}

export interface IVariation {
  period?: ITimestampMsec;
  minValue?: number;
  maxValue?: number;
  shiftX?: number;
}

export function generatePeriodicSeries(
  timeline: Array<Date>,
  options?: IVariation,
  periodType: PeriodType = PeriodType.Per5sec,
): any[] {
  const period: ITimestampMsec = options?.period ?? periods[periodType];
  return timeline.map((date) => {
    const timestamp = date.getTime();
    return {
      timestamp,
      value: periodicValue(
        timestamp,
        period,
        options?.minValue,
        options?.maxValue,
        options?.shiftX,
      ),
    };
  });
}

/**
 * Calculate value of sin(x) for test/fake records
 * @param t timestamp in ms
 * @param period in ms of the function
 * @param minValue
 * @param maxValue
 * @param shiftX optional shift by x in radian before applying sin(x)
 */
export function periodicValue(
  t: ITimestampMsec,
  period: ITimestampMsec = periods[PeriodType.Per5sec],
  minValue = 0.1,
  maxValue = 1.0,
  shiftX = 0,
): number {
  const x = (2 * Math.PI * t) / period;
  const y = Math.sin(x - shiftX);
  let value = ((y + 1.0) * (maxValue - minValue)) / 2 + minValue;
  value = Math.round(value * 1000) / 1000;
  return value;
}
