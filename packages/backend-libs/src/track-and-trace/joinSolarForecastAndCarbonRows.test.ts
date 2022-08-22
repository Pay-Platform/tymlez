import type { ICarbonEmissionDbRow } from '../carbon-emission';
import type { ISolarForecastDbRow } from '../solar-forecast';
import { joinSolarForecastAndCarbonRows } from './joinSolarForecastAndCarbonRows';

describe('joinSolarForecastAndCarbonRows', () => {
  it('should throw error when carbonRows contains duplicated rows', () => {
    expect(() =>
      joinSolarForecastAndCarbonRows({
        carbonRows: [
          {
            settlement_date: new Date('2022-01-01T00:00:00Z'),
          },
          {
            settlement_date: new Date('2022-01-01T00:00:00Z'),
          },
        ] as ICarbonEmissionDbRow[],
        solarForecastRows: [],
      }),
    ).toThrowError(/carbonRows have duplicated settlement_date/);
  });

  it('should throw error when solarForecastRows contains duplicated rows', () => {
    expect(() =>
      joinSolarForecastAndCarbonRows({
        carbonRows: [],
        solarForecastRows: [
          {
            period_end: new Date('2022-01-01T00:00:00Z'),
          },
          {
            period_end: new Date('2022-01-01T00:00:00Z'),
          },
        ] as ISolarForecastDbRow[],
      }),
    ).toThrowError(/solarForecastRows have duplicated period_end/);
  });

  it(
    `should return 2 rows when carbonRows and solarForecastRows ` +
      `have 2 rows with same keys`,
    () => {
      expect(
        joinSolarForecastAndCarbonRows({
          carbonRows: [
            {
              settlement_date: new Date('2022-01-01T00:00:00Z'),
              factor: 1,
            },
            {
              settlement_date: new Date('2022-01-01T00:05:00Z'),
              factor: 2,
            },
          ] as ICarbonEmissionDbRow[],
          solarForecastRows: [
            {
              period_end: new Date('2022-01-01T00:00:00Z'),
              pv_estimate: 11,
            },
            {
              period_end: new Date('2022-01-01T00:05:00Z'),
              pv_estimate: 12,
            },
          ] as ISolarForecastDbRow[],
        }),
      ).toEqual([
        {
          settlement_date: new Date('2022-01-01T00:00:00Z'),
          factor: 1,
          period_end: new Date('2022-01-01T00:00:00Z'),
          pv_estimate: 11,
        },
        {
          settlement_date: new Date('2022-01-01T00:05:00Z'),
          factor: 2,
          period_end: new Date('2022-01-01T00:05:00Z'),
          pv_estimate: 12,
        },
      ]);
    },
  );

  it(
    `should return 1 rows when carbonRows and solarForecastRows ` +
      `have 1 rows with same keys`,
    () => {
      expect(
        joinSolarForecastAndCarbonRows({
          carbonRows: [
            {
              settlement_date: new Date('2022-01-01T11:55:00Z'),
              factor: 1,
            },
            {
              settlement_date: new Date('2022-01-01T12:00:00Z'),
              factor: 2,
            },
          ] as ICarbonEmissionDbRow[],
          solarForecastRows: [
            {
              period_end: new Date('2022-01-01T12:00:00Z'),
              pv_estimate: 11,
            },
            {
              period_end: new Date('2022-01-01T12:05:00Z'),
              pv_estimate: 12,
            },
          ] as ISolarForecastDbRow[],
        }),
      ).toEqual([
        {
          settlement_date: new Date('2022-01-01T12:00:00Z'),
          factor: 2,
          period_end: new Date('2022-01-01T12:00:00Z'),
          pv_estimate: 11,
        },
      ]);
    },
  );

  it(
    `should return empty array when carbonRows and solarForecastRows ` +
      `have no row with same keys`,
    () => {
      expect(
        joinSolarForecastAndCarbonRows({
          carbonRows: [
            {
              settlement_date: new Date('2022-01-01T11:50:00Z'),
              factor: 1,
            },
            {
              settlement_date: new Date('2022-01-01T11:55:00Z'),
              factor: 2,
            },
          ] as ICarbonEmissionDbRow[],
          solarForecastRows: [
            {
              period_end: new Date('2022-01-01T12:00:00Z'),
              pv_estimate: 11,
            },
            {
              period_end: new Date('2022-01-01T12:05:00Z'),
              pv_estimate: 12,
            },
          ] as ISolarForecastDbRow[],
        }),
      ).toEqual([]);
    },
  );
});
