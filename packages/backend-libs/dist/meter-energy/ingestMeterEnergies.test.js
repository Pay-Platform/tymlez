"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ingestMeterEnergies_1 = require("./ingestMeterEnergies");
const insertMeterEnergies_1 = require("./insertMeterEnergies");
jest.mock('./insertMeterEnergies');
describe('ingestMeterEnergies', () => {
    describe(`
    given each meter has 2 channels, 
    when ingesting energy for 2 meters
  `, () => {
        beforeAll(async () => {
            jest.clearAllMocks();
            await (0, ingestMeterEnergies_1.ingestMeterEnergies)(getMockIngestMeterEnergiesInput());
        });
        it('should call insertMeterEnergies once with correct information', () => {
            expect(insertMeterEnergies_1.insertMeterEnergies).toHaveBeenCalledTimes(1);
            expect(insertMeterEnergies_1.insertMeterEnergies.mock.calls)
                .toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "energies": Array [
                Object {
                  "duration": 300000,
                  "eReactiveKwh_0": 0.01,
                  "eReactiveKwh_1": 0.02,
                  "eReactiveKwh_2": undefined,
                  "eReactiveKwh_3": undefined,
                  "eReactiveKwh_4": undefined,
                  "eReactiveKwh_5": undefined,
                  "eReactiveNegativeKwh_0": 0.011,
                  "eReactiveNegativeKwh_1": 0.022,
                  "eReactiveNegativeKwh_2": undefined,
                  "eReactiveNegativeKwh_3": undefined,
                  "eReactiveNegativeKwh_4": undefined,
                  "eReactiveNegativeKwh_5": undefined,
                  "eReactivePositiveKwh_0": 0.0111,
                  "eReactivePositiveKwh_1": 0.0221,
                  "eReactivePositiveKwh_2": undefined,
                  "eReactivePositiveKwh_3": undefined,
                  "eReactivePositiveKwh_4": undefined,
                  "eReactivePositiveKwh_5": undefined,
                  "eRealKwh_0": 0.1,
                  "eRealKwh_1": 0.2,
                  "eRealKwh_2": undefined,
                  "eRealKwh_3": undefined,
                  "eRealKwh_4": undefined,
                  "eRealKwh_5": undefined,
                  "eRealNegativeKwh_0": 0.11,
                  "eRealNegativeKwh_1": 0.22,
                  "eRealNegativeKwh_2": undefined,
                  "eRealNegativeKwh_3": undefined,
                  "eRealNegativeKwh_4": undefined,
                  "eRealNegativeKwh_5": undefined,
                  "eRealPositiveKwh_0": 0.111,
                  "eRealPositiveKwh_1": 0.222,
                  "eRealPositiveKwh_2": undefined,
                  "eRealPositiveKwh_3": undefined,
                  "eRealPositiveKwh_4": undefined,
                  "eRealPositiveKwh_5": undefined,
                  "iRMSMax_0": 0.8,
                  "iRMSMax_1": 0.9,
                  "iRMSMax_2": undefined,
                  "iRMSMax_3": undefined,
                  "iRMSMax_4": undefined,
                  "iRMSMax_5": undefined,
                  "iRMSMin_0": 0.1,
                  "iRMSMin_1": 0.2,
                  "iRMSMin_2": undefined,
                  "iRMSMin_3": undefined,
                  "iRMSMin_4": undefined,
                  "iRMSMin_5": undefined,
                  "meter_id": "meter_id 1",
                  "requestId": "requestId 1",
                  "timestamp": "2020-01-02T00:00:00.000Z",
                  "vRMSMax_0": 0.1,
                  "vRMSMax_1": 0.2,
                  "vRMSMax_2": undefined,
                  "vRMSMax_3": undefined,
                  "vRMSMax_4": undefined,
                  "vRMSMax_5": undefined,
                  "vRMSMin_0": 0.1,
                  "vRMSMin_1": 0.2,
                  "vRMSMin_2": undefined,
                  "vRMSMin_3": undefined,
                  "vRMSMin_4": undefined,
                  "vRMSMin_5": undefined,
                },
                Object {
                  "duration": 500000,
                  "eReactiveKwh_0": 0.03,
                  "eReactiveKwh_1": 0.04,
                  "eReactiveKwh_2": undefined,
                  "eReactiveKwh_3": undefined,
                  "eReactiveKwh_4": undefined,
                  "eReactiveKwh_5": undefined,
                  "eReactiveNegativeKwh_0": 0.031,
                  "eReactiveNegativeKwh_1": 0.042,
                  "eReactiveNegativeKwh_2": undefined,
                  "eReactiveNegativeKwh_3": undefined,
                  "eReactiveNegativeKwh_4": undefined,
                  "eReactiveNegativeKwh_5": undefined,
                  "eReactivePositiveKwh_0": 0.0311,
                  "eReactivePositiveKwh_1": 0.0421,
                  "eReactivePositiveKwh_2": undefined,
                  "eReactivePositiveKwh_3": undefined,
                  "eReactivePositiveKwh_4": undefined,
                  "eReactivePositiveKwh_5": undefined,
                  "eRealKwh_0": 0.3,
                  "eRealKwh_1": 0.4,
                  "eRealKwh_2": undefined,
                  "eRealKwh_3": undefined,
                  "eRealKwh_4": undefined,
                  "eRealKwh_5": undefined,
                  "eRealNegativeKwh_0": 0.31,
                  "eRealNegativeKwh_1": 0.42,
                  "eRealNegativeKwh_2": undefined,
                  "eRealNegativeKwh_3": undefined,
                  "eRealNegativeKwh_4": undefined,
                  "eRealNegativeKwh_5": undefined,
                  "eRealPositiveKwh_0": 0.311,
                  "eRealPositiveKwh_1": 0.422,
                  "eRealPositiveKwh_2": undefined,
                  "eRealPositiveKwh_3": undefined,
                  "eRealPositiveKwh_4": undefined,
                  "eRealPositiveKwh_5": undefined,
                  "iRMSMax_0": 0.8,
                  "iRMSMax_1": 0.9,
                  "iRMSMax_2": undefined,
                  "iRMSMax_3": undefined,
                  "iRMSMax_4": undefined,
                  "iRMSMax_5": undefined,
                  "iRMSMin_0": 0.1,
                  "iRMSMin_1": 0.2,
                  "iRMSMin_2": undefined,
                  "iRMSMin_3": undefined,
                  "iRMSMin_4": undefined,
                  "iRMSMin_5": undefined,
                  "meter_id": "meter_id 2",
                  "requestId": "requestId 1",
                  "timestamp": "2021-03-04T00:00:00.000Z",
                  "vRMSMax_0": 0.1,
                  "vRMSMax_1": 0.2,
                  "vRMSMax_2": undefined,
                  "vRMSMax_3": undefined,
                  "vRMSMax_4": undefined,
                  "vRMSMax_5": undefined,
                  "vRMSMin_0": 0.1,
                  "vRMSMin_1": 0.2,
                  "vRMSMin_2": undefined,
                  "vRMSMin_3": undefined,
                  "vRMSMin_4": undefined,
                  "vRMSMin_5": undefined,
                },
              ],
              "skipCheckExists": undefined,
            },
          ],
        ]
      `);
        });
    });
    describe(`
    given each meter has 2 channels, 
    when ingesting energy for a meter that has 0 eRealKwh channel`, () => {
        let response;
        beforeAll(() => {
            jest.clearAllMocks();
            response = (0, ingestMeterEnergies_1.ingestMeterEnergies)(getMockIngestMeterEnergiesInput({
                energyResponses: [
                    {
                        meter_id: 'meter_id 1',
                        duration: 300,
                        timestamp: new Date('2020-01-02T00:00:00Z').getTime() / 1000,
                        eRealKwh: [],
                    },
                ],
            }));
        });
        it('should failed', async () => {
            await expect(response).rejects.toThrowError(/number of eRealKwh is 0/);
        });
        it('should not call insertMeterEnergies', () => {
            expect(insertMeterEnergies_1.insertMeterEnergies).toHaveBeenCalledTimes(0);
        });
    });
});
function getMockIngestMeterEnergiesInput(overrides) {
    return {
        requestId: 'requestId 1',
        energyResponses: [
            {
                meter_id: 'meter_id 1',
                duration: 300,
                timestamp: new Date('2020-01-02T00:00:00Z').getTime() / 1000,
                eRealKwh: [0.1, 0.2],
                eRealNegativeKwh: [0.11, 0.22],
                eRealPositiveKwh: [0.111, 0.222],
                eReactiveKwh: [0.01, 0.02],
                eReactiveNegativeKwh: [0.011, 0.022],
                eReactivePositiveKwh: [0.0111, 0.0221],
                iRMSMin: [0.1, 0.2],
                iRMSMax: [0.8, 0.9],
                vRMSMin: [0.1, 0.2],
                vRMSMax: [0.1, 0.2],
            },
            {
                meter_id: 'meter_id 2',
                duration: 500,
                timestamp: new Date('2021-03-04T00:00:00Z').getTime() / 1000,
                eRealKwh: [0.3, 0.4],
                eRealNegativeKwh: [0.31, 0.42],
                eRealPositiveKwh: [0.311, 0.422],
                eReactiveKwh: [0.03, 0.04],
                eReactiveNegativeKwh: [0.031, 0.042],
                eReactivePositiveKwh: [0.0311, 0.0421],
                iRMSMin: [0.1, 0.2],
                iRMSMax: [0.8, 0.9],
                vRMSMin: [0.1, 0.2],
                vRMSMax: [0.1, 0.2],
            },
        ],
        ...overrides,
    };
}
//# sourceMappingURL=ingestMeterEnergies.test.js.map