import { restoreConsole, suppressConsole } from '@tymlez/test-libs/src/jest';
import { insertMeterEnergies } from './insertMeterEnergies';
import type { IInsertMeterEnergyInput } from './IInsertMeterEnergyInput';
import { getMeterDbPool } from '../meter-db/getMeterDbPool';

jest.mock('../meter-db/getMeterDbPool', () => ({
  getMeterDbPool: jest.fn().mockReturnValue({
    end: jest.fn(),
    query: jest.fn().mockReturnValue({ rows: [] }),
  }),
}));

beforeAll(() => {
  suppressConsole({ debug: false });
});

afterAll(() => {
  restoreConsole();
});

describe('insertMeterEnergies', () => {
  describe('given insert 2 energies pass', () => {
    beforeAll(async () => {
      jest.clearAllMocks();

      await insertMeterEnergies({
        energies: [
          {
            duration: 1,
            timestamp: new Date().toISOString(),
            requestId: 'test 1',
          },
          {
            duration: 1,
            timestamp: new Date().toISOString(),
            requestId: 'test 1',
          },
        ] as IInsertMeterEnergyInput[],
        skipCheckExists: false,
      });
    });

    it('should call getMeterDbPool once', () => {
      expect(getMeterDbPool).toHaveBeenCalledTimes(1);
    });

    it('should call collection query twice', () => {
      const { query } = (getMeterDbPool as jest.Mock).mock.results[0].value;

      const namedQueries = (query as jest.Mock).mock.calls
        .filter((s) => s[0].name === 'insert-meter-energies')
        .flat();

      expect(namedQueries).toMatchObject([
        {
          name: 'insert-meter-energies',
          text: expect.any(String),
          values: expect.any(Array),
        },
        {
          name: 'insert-meter-energies',
          text: expect.any(String),
          values: expect.any(Array),
        },
      ]);
    });

    it('should call collection pool > end()', () => {
      const { end } = (getMeterDbPool as jest.Mock).mock.results[0].value;
      expect(end).toHaveBeenCalledTimes(1);
    });
  });

  describe('given insert energy failed because of missing requestId', () => {
    let response: ReturnType<typeof insertMeterEnergies>;

    beforeAll(() => {
      jest.clearAllMocks();

      response = insertMeterEnergies({
        energies: [
          {
            duration: 1,
            timestamp: new Date().toISOString(),
          },
        ] as IInsertMeterEnergyInput[],
        skipCheckExists: false,
      });
    });

    it('should throw error', async () => {
      await expect(response).rejects.toThrowError(/requestId is missing/);
    });

    it('should call getMeterDbPool once', () => {
      expect(getMeterDbPool).toHaveBeenCalledTimes(1);
    });

    it('should call collection pool > end()', () => {
      const { end } = (getMeterDbPool as jest.Mock).mock.results[0].value;
      expect(end).toHaveBeenCalledTimes(1);
    });
  });
});
