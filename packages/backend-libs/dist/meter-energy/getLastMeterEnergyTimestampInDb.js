"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastMeterEnergyTimestampInDb = void 0;
const assert_1 = __importDefault(require("assert"));
const meter_db_1 = require("../meter-db");
async function getLastMeterEnergyTimestampInDb({ meterId, }) {
    return await (0, meter_db_1.useMeterDbPool)(async (pool) => {
        const { rows } = (meterId
            ? await pool.query(`
              select last(timestamp) timestamp from 'meter_energy'
              where meter_id = $1;
            `, [meterId])
            : await pool.query(`
              select last(timestamp) timestamp from 'meter_energy';
            `));
        (0, assert_1.default)(rows.length === 1, `Number of last meter energies is ${rows.length}, expect 1`);
        return rows[0].timestamp;
    });
}
exports.getLastMeterEnergyTimestampInDb = getLastMeterEnergyTimestampInDb;
//# sourceMappingURL=getLastMeterEnergyTimestampInDb.js.map