"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstMeterEnergyTimestampInDb = void 0;
const assert_1 = __importDefault(require("assert"));
const meter_db_1 = require("../meter-db");
async function getFirstMeterEnergyTimestampInDb({ meterId, minTimestamp, } = {}) {
    return await (0, meter_db_1.useMeterDbPool)(async (pool) => {
        const { rows } = (meterId
            ? await pool.query(`
              select first(timestamp) timestamp from 'meter_energy'
              where meter_id = $1;
            `, [meterId])
            : await pool.query(`
              select first(timestamp) timestamp from 'meter_energy';
            `));
        (0, assert_1.default)(rows.length === 1, `Number of first meter energies is ${rows.length}, expect 1`);
        if (minTimestamp && rows[0].timestamp.getTime() < minTimestamp.getTime()) {
            return minTimestamp;
        }
        return rows[0].timestamp;
    });
}
exports.getFirstMeterEnergyTimestampInDb = getFirstMeterEnergyTimestampInDb;
//# sourceMappingURL=getFirstMeterEnergyTimestampInDb.js.map