import {
  fetchFirstLongEnergies,
  fetchLongEnergy,
  useMeterDbPool,
} from '@tymlez/backend-libs';
import { toTimestampSec } from '@tymlez/common-libs';
import { restoreConsole, suppressConsole } from '@tymlez/test-libs/src/jest';
import { getHistoricalEnergyStream } from './getHistoricalEnergyStream';

jest.mock('@tymlez/backend-libs', () => ({
  ...jest.requireActual('@tymlez/backend-libs'),
  useMeterDbPool: jest.fn(),
  fetchLatestLongEnergies: jest.fn(),
  fetchLongEnergy: jest.fn(),
  fetchFirstLongEnergies: jest.fn(),
}));

beforeAll(() => {
  suppressConsole({ debug: false });
});

afterAll(() => {
  restoreConsole();
});

describe('insertMeterEnergies', () => {
  describe('given wattwatchers has data before what is in the QuestDB', () => {
    let next: Awaited<ReturnType<typeof getHistoricalEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [
              {
                timestamp: new Date('2021-12-15T00:00:00Z'),
              },
            ],
          }),
        };

        return await callback(pool);
      });

      (fetchFirstLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:00:00Z')),
        },
      ]);

      next = await getHistoricalEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
      });
    });

    it(`should return the correct data from wattwatchers in reverse time order
        when calling next the first time`, async () => {
      const longEnergies = [
        {
          timestamp: toTimestampSec(new Date('2021-12-14T23:50:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-14T23:55:00Z')),
        },
      ];

      (fetchLongEnergy as jest.Mock).mockResolvedValue(longEnergies.slice());

      const energies = await next();

      expect(energies).toEqual(longEnergies.slice().reverse());
    });

    it(`should return the correct data from wattwatchers in reverse time order
        when calling next the second time`, async () => {
      const longEnergies = [
        {
          timestamp: toTimestampSec(new Date('2021-12-14T23:40:00Z')),
        },
        {
          timestamp: toTimestampSec(new Date('2021-12-14T23:45:00Z')),
        },
      ];

      (fetchLongEnergy as jest.Mock).mockResolvedValue(longEnergies.slice());

      const energies = await next();

      expect(energies).toEqual(longEnergies.slice().reverse());
    });

    it('should call fetchLongEnergy twice with correct parameters', async () => {
      expect(fetchLongEnergy).toHaveBeenCalledTimes(2);

      expect((fetchLongEnergy as jest.Mock).mock.calls[0][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-08T00:00:00.000Z'),
        toDate: new Date('2021-12-15T00:00:00.000Z'),
      });

      expect((fetchLongEnergy as jest.Mock).mock.calls[1][0]).toEqual({
        apiKey: 'apiKey 1',
        deviceId: 'meterId 1',
        fromDate: new Date('2021-12-07T23:50:00.000Z'),
        toDate: new Date('2021-12-14T23:50:00.000Z'),
      });
    });
  });

  describe('given wattwatchers has data, but QuestDB has no data', () => {
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

      (fetchFirstLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-01T00:00:00Z')),
        },
      ]);
    });

    it('should call throw error when calling getHistoricalEnergyStream', async () => {
      await expect(
        getHistoricalEnergyStream({
          meterId: 'meterId 1',
          apiKey: 'apiKey 1',
        }),
      ).rejects.toThrowError(/Number of firstEnergies in DB for.+expect 1/);
    });
  });

  describe('given wattwatchers does not have data before what is in the QuestDB', () => {
    let next: Awaited<ReturnType<typeof getHistoricalEnergyStream>>;
    beforeAll(async () => {
      jest.clearAllMocks();

      (useMeterDbPool as jest.Mock).mockImplementation(async (callback) => {
        const pool = {
          query: jest.fn().mockResolvedValue({
            rows: [
              {
                timestamp: new Date('2021-12-15T00:00:00Z'),
              },
            ],
          }),
        };

        return await callback(pool);
      });

      (fetchFirstLongEnergies as jest.Mock).mockResolvedValue([
        {
          timestamp: toTimestampSec(new Date('2021-12-15T00:00:00Z')),
        },
      ]);

      next = await getHistoricalEnergyStream({
        meterId: 'meterId 1',
        apiKey: 'apiKey 1',
      });
    });

    it('should return empty data from next()', async () => {
      const energies = await next();
      expect(energies).toEqual([]);
    });

    it('should not call fetchLongEnergy', async () => {
      expect(fetchLongEnergy).toHaveBeenCalledTimes(0);
    });
  });
});
