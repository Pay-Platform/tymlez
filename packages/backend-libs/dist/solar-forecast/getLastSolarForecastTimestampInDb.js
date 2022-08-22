"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastSolarForecastTimestampInDb = void 0;
const assert_1 = __importDefault(require("assert"));
const meter_db_1 = require("../meter-db");
async function getLastSolarForecastTimestampInDb({ resourceId, } = {}) {
    return await (0, meter_db_1.useMeterDbPool)(async (pool) => {
        const { rows } = (resourceId
            ? await pool.query(`
              select cast( period_end as timestamp) period_end, * 
              from solar_forecast
              latest by resource_id, period_end
              where resource_id = $1
              order by period_end desc
              limit 1
            `, [resourceId])
            : await pool.query(`
              select cast( period_end as timestamp) period_end, * 
              from solar_forecast
              latest by resource_id, period_end
              order by period_end desc
              limit 1
            `));
        (0, assert_1.default)(rows.length === 1, `Number of first solar forecasts is ${rows.length}, expect 1`);
        return rows[0].period_end;
    });
}
exports.getLastSolarForecastTimestampInDb = getLastSolarForecastTimestampInDb;
//# sourceMappingURL=getLastSolarForecastTimestampInDb.js.map