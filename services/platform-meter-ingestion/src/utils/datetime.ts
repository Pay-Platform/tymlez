import type { IIsoDate } from '@tymlez/platform-api-interfaces';

export function findIntervals(
  startDate: IIsoDate,
  endDate: IIsoDate,
  intervalInSeconds: number,
) {
  const found = [];
  let currentDate = startDate;

  while (currentDate < endDate) {
    found.push(currentDate);

    currentDate = new Date(
      new Date(currentDate).getTime() + intervalInSeconds * 1000,
    ).toISOString();
  }

  return found;
}

export function findMissingTimestamps(
  hay: IIsoDate[],
  startDate: IIsoDate,
  endDate: IIsoDate,
  intervalInSeconds = 300,
) {
  const intervals = findIntervals(startDate, endDate, intervalInSeconds);

  return intervals.filter((i) => hay.indexOf(i) < 0);
}
