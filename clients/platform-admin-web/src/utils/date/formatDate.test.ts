import { endOfDay } from 'date-fns';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('returns correct formatted data for start of day', () => {
    expect(formatDate(new Date(2020, 0, 1))).toBe('2020-01-01');
  });

  it('returns correct formatted data for end of day', () => {
    expect(formatDate(endOfDay(new Date(2020, 0, 1)))).toBe('2020-01-01');
  });
});
