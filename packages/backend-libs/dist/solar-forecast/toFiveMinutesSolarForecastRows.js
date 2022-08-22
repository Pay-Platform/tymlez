"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFiveMinutesSolarForecastRows = void 0;
const date_fns_1 = require("date-fns");
const lodash_1 = require("lodash");
const assert_1 = __importDefault(require("assert"));
function toFiveMinutesSolarForecastRows({ thirtyMinutesSolarForecastRows, }) {
    return (0, lodash_1.reduce)(thirtyMinutesSolarForecastRows, (acc, row) => {
        (0, assert_1.default)(row.period === 'PT30M', `Solar forecast period is ${row.period}, expect PT30M`);
        (0, lodash_1.range)(0, 6).forEach((i) => {
            acc.push({
                ...row,
                period_end: (0, date_fns_1.addMinutes)(row.period_end, i * 5),
                pv_estimate: row.pv_estimate / 6,
                pv_estimate10: row.pv_estimate10 / 6,
                pv_estimate90: row.pv_estimate90 / 6,
                period: 'PT05M',
            });
        });
        return acc;
    }, []);
}
exports.toFiveMinutesSolarForecastRows = toFiveMinutesSolarForecastRows;
//# sourceMappingURL=toFiveMinutesSolarForecastRows.js.map