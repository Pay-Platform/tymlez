import { suppressConsole, restoreConsole } from '@tymlez/test-libs/src/jest';
import { findIntervals, findMissingTimestamps } from './datetime';

beforeAll(() => {
  suppressConsole({ debug: true });
});

afterAll(() => {
  restoreConsole();
});

describe('findIntervals', () => {
  it('should find timestamps between two date', () => {
    const intervals = findIntervals(
      '2021-12-15T12:00:00.000Z',
      '2021-12-15T12:30:00.000Z',
      300,
    );
    expect(intervals.length).toBe(6);
  });
});

describe('findMissingTimestamps', () => {
  it('should find missing timestamps between intervals', () => {
    const timestamps = [
      '2021-12-15T12:00:00.000Z',
      '2021-12-15T12:05:00.000Z',
      '2021-12-15T12:15:00.000Z',
      '2021-12-15T12:20:00.000Z',
      '2021-12-15T12:25:00.000Z',
    ];
    const missing = findMissingTimestamps(
      timestamps,
      '2021-12-15T12:00:00.000Z',
      '2021-12-15T12:30:00.000Z',
    );
    expect(missing).toEqual(['2021-12-15T12:10:00.000Z']);
  });
});
