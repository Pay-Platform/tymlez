"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinSolarForecastAndCarbonRows = void 0;
const lodash_1 = require("lodash");
const common_libs_1 = require("@tymlez/common-libs");
const assert_1 = __importDefault(require("assert"));
function joinSolarForecastAndCarbonRows({ carbonRows, solarForecastRows, }) {
    (0, assert_1.default)(!(0, common_libs_1.hasDuplicates)(carbonRows, (row) => row.settlement_date.toISOString()), `carbonRows have duplicated settlement_date`);
    (0, assert_1.default)(!(0, common_libs_1.hasDuplicates)(solarForecastRows, (row) => row.period_end.toISOString()), `solarForecastRows have duplicated period_end`);
    const carbonRowsMap = (0, lodash_1.keyBy)(carbonRows, (row) => row.settlement_date.toISOString());
    const solarForecastAndCarbonRows = (0, lodash_1.reduce)(solarForecastRows, (acc, solarForecastRow) => {
        const carbonRow = carbonRowsMap[solarForecastRow.period_end.toISOString()];
        if (carbonRow) {
            acc.push({
                ...solarForecastRow,
                ...carbonRow,
            });
        }
        return acc;
    }, []);
    return solarForecastAndCarbonRows;
}
exports.joinSolarForecastAndCarbonRows = joinSolarForecastAndCarbonRows;
//# sourceMappingURL=joinSolarForecastAndCarbonRows.js.map