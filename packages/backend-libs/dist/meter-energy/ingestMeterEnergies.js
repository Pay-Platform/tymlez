"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestMeterEnergies = void 0;
const assert_1 = __importDefault(require("assert"));
const lodash_1 = require("lodash");
const insertMeterEnergies_1 = require("./insertMeterEnergies");
const MAX_NUM_CHANNELS = 6;
async function ingestMeterEnergies({ requestId, energyResponses, skipCheckExists, }) {
    const energies = energyResponses.map((response) => toEnergy(response, requestId));
    await (0, insertMeterEnergies_1.insertMeterEnergies)({
        energies,
        skipCheckExists,
    });
}
exports.ingestMeterEnergies = ingestMeterEnergies;
function toEnergy(response, requestId) {
    (0, assert_1.default)(response.eRealKwh.length !== 0, `For ${response.meter_id}, number of eRealKwh is ${response.eRealKwh.length}, ` +
        `expect more than 0.`);
    ENERGY_KEYS.forEach((key) => {
        (0, assert_1.default)(response.eRealKwh.length === response[key]?.length, `For ${response.meter_id}, number of eRealKwh (${response.eRealKwh.length}) ` +
            `not equal to number of ${key} (${response[key]?.length})`);
    });
    const energy = {
        meter_id: response.meter_id,
        duration: response.duration * 1000,
        timestamp: new Date(response.timestamp * 1000).toISOString(),
        requestId,
        ...(0, lodash_1.range)(0, MAX_NUM_CHANNELS).reduce((acc, i) => {
            return {
                ...acc,
                [`eRealKwh_${i}`]: response.eRealKwh[i],
                [`eRealNegativeKwh_${i}`]: response.eRealNegativeKwh[i],
                [`eRealPositiveKwh_${i}`]: response.eRealPositiveKwh[i],
                [`eReactiveKwh_${i}`]: response.eReactiveKwh[i],
                [`eReactiveNegativeKwh_${i}`]: response.eReactiveNegativeKwh[i],
                [`eReactivePositiveKwh_${i}`]: response.eReactivePositiveKwh[i],
                [`iRMSMin_${i}`]: response.iRMSMin[i],
                [`iRMSMax_${i}`]: response.iRMSMax[i],
                [`vRMSMin_${i}`]: response.vRMSMin[i],
                [`vRMSMax_${i}`]: response.vRMSMax[i],
            };
        }, {}),
    };
    // Valid `energy at runtime because we constructed it dynamically
    // which TypeScript cannot catch the error
    ENERGY_KEYS.forEach((key) => {
        (0, assert_1.default)(!(0, lodash_1.isNil)(energy[`${key}_0`]), `Missing ${key} in ${JSON.stringify(energy)}`);
    });
    return energy;
}
const ENERGY_KEYS = [
    'eRealKwh',
    'eRealNegativeKwh',
    'eRealPositiveKwh',
    'eReactiveKwh',
    'eReactiveNegativeKwh',
    'eReactivePositiveKwh',
    'iRMSMin',
    'iRMSMax',
    'vRMSMin',
    'vRMSMax',
];
//# sourceMappingURL=ingestMeterEnergies.js.map