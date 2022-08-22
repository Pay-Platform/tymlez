"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolarForecastDbRows = void 0;
const meter_db_1 = require("../meter-db");
async function getSolarForecastDbRows({ resourceId, fromTimestamp, toTimestamp, }) {
    return await (0, meter_db_1.useMeterDbPool)(async (pool) => {
        const { rows } = (await pool.query(`
        select cast( period_end as timestamp) period_end, * 
        from solar_forecast 
        latest by resource_id, period_end
        where resource_id = $1
          and period_end >= $2
          and period_end < $3
        order by period_end;
      `, [
            resourceId,
            fromTimestamp.toISOString(),
            toTimestamp.toISOString(),
        ]));
        return rows;
    });
}
exports.getSolarForecastDbRows = getSolarForecastDbRows;
//# sourceMappingURL=getSolarForecastDbRows.js.map