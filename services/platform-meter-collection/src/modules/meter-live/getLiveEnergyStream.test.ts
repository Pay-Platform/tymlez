import {
  fetchLatestLongEnergies,
  fetchLongEnergy,
  useMeterDbPool,
} from '@tymlez/backend-libs';
import { toTimestampSec } from '@tymlez/common-libs';
import FakeTimers from '@sinonjs/fake-timers';
import { getLiveEnergyStream } from './getLiveEnergyStream';

jest.mock('@tymlez/backend-libs', () => ({
  ...jest.requireActual('@tymlez/backend-libs'),
  useMeterDbPool: jest.fn(),
  fetchLatestLongEnergies: jest.fn(),
  fetchLongEnergy: jest.fn(),
}));

let clock: FakeTimers.InstalledClock;
beforeAll(() => {
  clock = FakeTimers.install({
    now: new Date('2021-12-15T00:00:00Z'),
    shouldAdvanceTime: true,
  });
});

afterAll(() => {
  clock.uninstall();
});

describe('getLiveEnergyStream', () => {
  describe('given wattwatchers has data later than what is in the QuestDB', () => {
    let next: Awaited<ReturnType<typeof getLiveEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      // QuestDB data
      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [
              {
                timestamp: new Date('2021-12-01T00:00:00Z'),
              },
            ],
          }),
        };

        return await callback(pool);
      });

      // Wattwatchers data
      (fetchLatestLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-15T00:00:00Z')),
        },
      ]);

      next = await getLiveEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
        hoursPerCall: 12,
      });
    });

    it(`should return the correct data from wattwatchers in the same time order
        when calling next the first time`, async () => {
      const longEnergies = [
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:05:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:10:00Z')),
        },
      ];

      (fetchLongEnergy as jest.Mock).mockResolvedValue(longEnergies.slice());

      const energies = await next();

      expect(energies).toEqual(longEnergies);
    });

    it(`should return the correct data from wattwatchers in the same time order
        when calling next the second time`, async () => {
      const longEnergies = [
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:15:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:20:00Z')),
        },
      ];

      (fetchLongEnergy as jest.Mock).mockResolvedValue(longEnergies.slice());

      const energies = await next();

      expect(energies).toEqual(longEnergies);
    });

    it('should call fetchLongEnergy twice with correct parameters', async () => {
      expect(fetchLongEnergy).toHaveBeenCalledTimes(2);

      expect((fetchLongEnergy as jest.Mock).mock.calls[0][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-01T00:00:01Z'),
        toDate: new Date('2021-12-01T12:00:01Z'),
      });

      expect((fetchLongEnergy as jest.Mock).mock.calls[1][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-01T00:10:01Z'),
        toDate: new Date('2021-12-01T12:10:01Z'),
      });
    });
  });

  describe('given wattwatchers has data later than what is in the QuestDB', () => {
    let next: Awaited<ReturnType<typeof getLiveEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [
              {
                timestamp: new Date('2021-12-01T00:00:00Z'),
              },
            ],
          }),
        };

        return await callback(pool);
      });

      (fetchLatestLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-15T00:00:00Z')),
        },
      ]);

      next = await getLiveEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
        hoursPerCall: 12,
      });
    });

    it(`should throw error if wattwatchers returns missing data`, async () => {
      (fetchLongEnergy as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:05:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:10:00Z')),
        },
      ]);

      await next();

      // Missing data between 2021-12-01T00:10:00Z and 2021-12-01T00:25:00Z
      (fetchLongEnergy as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:25:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:30:00Z')),
        },
      ]);

      await expect(next()).rejects.toThrowError(
        /does not equal to the duration of 300000 ms/,
      );
    });
  });

  describe('given wattwatchers does not have data later than what is in the QuestDB', () => {
    let next: Awaited<ReturnType<typeof getLiveEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [
              {
                timestamp: new Date('2021-12-01T00:00:00Z'),
              },
            ],
          }),
        };

        return await callback(pool);
      });

      (fetchLatestLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:00:00Z')),
        },
      ]);

      next = await getLiveEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
        hoursPerCall: 12,
      });
    });

    it(`should return empty data from next`, async () => {
      const energies = await next();

      expect(energies).toEqual([]);
    });

    it(`should not call fetchLongEnergy`, async () => {
      expect(fetchLongEnergy).toBeCalledTimes(0);
    });
  });

  describe('given wattwatchers has data, no data in QuestDB, 12 hours per call', () => {
    let next: Awaited<ReturnType<typeof getLiveEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [],
          }),
        };

        return await callback(pool);
      });

      (fetchLatestLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date()),
        },
      ]);

      next = await getLiveEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
        hoursPerCall: 12,
      });
    });

    it(`should call fetchLongEnergy with fromDate: 1 day before now and toDate: 12 hours later
        when calling next the first time`, async () => {
      (fetchLongEnergy as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-14T00:00:00Z')),
        },
      ]);

      await next();
      expect(fetchLongEnergy).toHaveBeenCalledTimes(1);

      expect((fetchLongEnergy as jest.Mock).mock.calls[0][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-14T00:00:00.000Z'),
        toDate: new Date('2021-12-14T12:00:00.000Z'),
      });
    });

    it(`should call fetchLongEnergy with fromDate: 1 second from the last response and 
        toDate: 12 hours later, when calling next the second time`, async () => {
      (fetchLongEnergy as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-14T00:05:00Z')),
        },
      ]);

      await next();
      expect(fetchLongEnergy).toHaveBeenCalledTimes(2);

      expect((fetchLongEnergy as jest.Mock).mock.calls[1][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-14T00:00:01.000Z'),
        toDate: new Date('2021-12-14T12:00:01.000Z'),
      });
    });
  });
});
