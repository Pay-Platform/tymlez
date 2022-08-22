export const datesRangeByTimeout = (
  minTimestamp: number,
  maxTimestamp: number,
  timeout: number,
): number[] => {
  const dates: number[] = [];
  let i = minTimestamp;
  while (i <= maxTimestamp) {
    dates.push(i);
    i += timeout;
  }
  return dates;
};
