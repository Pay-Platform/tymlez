import { truncToMinutes } from './truncToMinutes';

describe('truncToMinutes', () => {
  it('should throw error when boundary is <= 0', () => {
    expect(() => truncToMinutes(new Date(), 0)).toThrowError(
      /expect larger than 0/,
    );

    expect(() => truncToMinutes(new Date(), -1)).toThrowError(
      /expect larger than 0/,
    );
  });

  it('should throw error when boundary is not integer', () => {
    expect(() => truncToMinutes(new Date(), 0.5)).toThrowError(
      /expect to be integer/,
    );

    expect(() => truncToMinutes(new Date(), 1.1)).toThrowError(
      /expect to be integer/,
    );
  });

  describe('30-minute boundary', () => {
    const boundary = 30;

    it('should return the same date when input date is already at the 30-minute boundary', () => {
      expect(
        truncToMinutes(new Date('2022-01-01T12:00:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:00:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:00:00Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:00:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:30:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:30:00Z'));
    });

    it.each([
      new Date('2022-01-01T12:00:00.001Z'),
      new Date('2022-01-01T12:00:01Z'),
      new Date('2022-01-01T12:05:00Z'),
      new Date('2022-01-01T12:10:00Z'),
      new Date('2022-01-01T12:14:59.999Z'),
      new Date('2022-01-01T12:15:00Z'),
      new Date('2022-01-01T12:29:59Z'),
      new Date('2022-01-01T12:29:59.999Z'),
    ])('should return 30-minute boundary before the input date %s', (date) => {
      expect(truncToMinutes(date, boundary)).toEqual(
        new Date('2022-01-01T12:00:00Z'),
      );
    });
  });

  describe('15-minute boundary', () => {
    const boundary = 15;

    it('should return the same date when input date is already at the 15-minute boundary', () => {
      expect(
        truncToMinutes(new Date('2022-01-01T12:15:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:15:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:15:00Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:15:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:30:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:30:00Z'));
    });

    it.each([
      new Date('2022-01-01T12:15:00.001Z'),
      new Date('2022-01-01T12:15:01Z'),
      new Date('2022-01-01T12:29:59Z'),
      new Date('2022-01-01T12:29:59.999Z'),
    ])('should return 15-minute boundary before the input date %s', (date) => {
      expect(truncToMinutes(date, boundary)).toEqual(
        new Date('2022-01-01T12:15:00Z'),
      );
    });
  });

  describe('1-minute boundary', () => {
    const boundary = 1;

    it('should return the same date when input date is already at the 1-minute boundary', () => {
      expect(
        truncToMinutes(new Date('2022-01-01T12:01:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:01:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:01:00Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:01:00Z'));
      expect(
        truncToMinutes(new Date('2022-01-01T12:02:00.000Z'), boundary),
      ).toEqual(new Date('2022-01-01T12:02:00Z'));
    });

    it.each([
      new Date('2022-01-01T12:01:00.001Z'),
      new Date('2022-01-01T12:01:01Z'),
      new Date('2022-01-01T12:01:59Z'),
      new Date('2022-01-01T12:01:59.999Z'),
    ])('should return 1-minute boundary before the input date %s', (date) => {
      expect(truncToMinutes(date, boundary)).toEqual(
        new Date('2022-01-01T12:01:00Z'),
      );
    });
  });
});
