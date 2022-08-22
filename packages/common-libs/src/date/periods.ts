import {
  differenceInMonths,
  differenceInDays,
  differenceInHours,
} from 'date-fns';

export type PeriodType = 'perMonth' | 'perDay' | 'perHour' | 'perMinute';

export function getPeriodType(from: Date, to: Date): PeriodType {
  if (differenceInHours(to, from) < 7) {
    return 'perMinute';
  }

  if (differenceInDays(to, from) <= 7) {
    return 'perHour';
  }

  if (differenceInMonths(to, from) < 6) {
    return 'perDay';
  }

  return 'perMonth';
}
