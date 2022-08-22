import { format } from 'date-fns';
import type { AustralianRegion } from '@tymlez/common-libs';

export const formatDate = (date: Date | number) => format(date, 'yyyy-MM-dd');
export const formatDateTime = (date: Date | number) =>
  format(date, 'yyyy-MM-dd HH:mm:ss.SSS');
export const formatRelatimeDate = (date: Date | number) =>
  format(date, 'HH:mm:ss');
export const formatDateTimeForTimeseriesTooltip = (date: Date) =>
  format(date, 'dd MMM HH:mm');
export const formatDateTimeForRealtimeTimeseriesTooltip = (date: Date) =>
  format(date, 'dd MMM HH:mm:ss');
export const formatMillisecondsWithTimeZone = (milliseconds: number) => {
  const region = localStorage.getItem('region');
  const timezone = {
    QLD1: 'Australia/Brisbane',
    NSW1: 'Australia/Sydney',
    SA1: 'Australia/Adelaide',
    TAS1: 'Australia/Hobart',
    VIC1: 'Australia/Melbourne',
    default: 'Australia/Brisbane',
  };
  const date = new Date(milliseconds);
  const convertDateWithTimezone = date.toLocaleString('en-US', {
    timeZone: timezone[(region as AustralianRegion) || 'default'],
  });
  const convertDateToMilliseconds = new Date(convertDateWithTimezone).getTime();
  return convertDateToMilliseconds;
};
