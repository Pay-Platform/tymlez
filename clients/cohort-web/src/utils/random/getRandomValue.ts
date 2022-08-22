import { getRandomIntInclusive } from './getRandomIntInclusive';

export const getRandomValue = (index: number): number => {
  const minValue = (index + 1) * 10;
  const maxValue = minValue + getRandomIntInclusive(1, 3) * 10;
  return getRandomIntInclusive(minValue, maxValue);
};
