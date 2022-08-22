"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarbonEmissionDbRows = void 0;
const meter_db_1 = require("../meter-db");
async function getCarbonEmissionDbRows({ region, fromTimestamp, toTimestamp, }) {
    return await (0, meter_db_1.useMeterDbPool)(async (pool) => {
        const { rows } = (await pool.query(`
        select * from 'carbon_emissions'
        where regionid = $1
          and settlement_date >= $2
          and settlement_date < $3
        order by settlement_date;
      `, [region, fromTimestamp.toISOString(), toTimestamp.toISOString()]));
        return rows;
    });
}
exports.getCarbonEmissionDbRows = getCarbonEmissionDbRows;
//# sourceMappingURL=getCarbonEmissionDbRows.js.map