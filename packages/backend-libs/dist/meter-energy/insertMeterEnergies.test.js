"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insertMeterEnergies_1 = require("./insertMeterEnergies");
const getMeterDbPool_1 = require("../meter-db/getMeterDbPool");
jest.mock('../meter-db/getMeterDbPool', () => ({
    getMeterDbPool: jest.fn().mockReturnValue({
        end: jest.fn(),
        query: jest.fn().mockReturnValue({ rows: [] }),
    }),
}));
describe('insertMeterEnergies', () => {
    describe('given insert 2 energies pass', () => {
        beforeAll(async () => {
            jest.clearAllMocks();
            await (0, insertMeterEnergies_1.insertMeterEnergies)({
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
                ],
                skipCheckExists: false,
            });
        });
        it('should call getMeterDbPool once', () => {
            expect(getMeterDbPool_1.getMeterDbPool).toHaveBeenCalledTimes(1);
        });
        it('should call collection query twice', () => {
            const { query } = getMeterDbPool_1.getMeterDbPool.mock.results[0].value;
            const namedQueries = query.mock.calls
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
            const { end } = getMeterDbPool_1.getMeterDbPool.mock.results[0].value;
            expect(end).toHaveBeenCalledTimes(1);
        });
    });
    describe('given insert energy failed because of missing requestId', () => {
        let response;
        beforeAll(() => {
            jest.clearAllMocks();
            response = (0, insertMeterEnergies_1.insertMeterEnergies)({
                energies: [
                    {
                        duration: 1,
                        timestamp: new Date().toISOString(),
                    },
                ],
                skipCheckExists: false,
            });
        });
        it('should throw error', async () => {
            await expect(response).rejects.toThrowError(/requestId is missing/);
        });
        it('should call getMeterDbPool once', () => {
            expect(getMeterDbPool_1.getMeterDbPool).toHaveBeenCalledTimes(1);
        });
        it('should call collection pool > end()', () => {
            const { end } = getMeterDbPool_1.getMeterDbPool.mock.results[0].value;
            expect(end).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=insertMeterEnergies.test.js.map