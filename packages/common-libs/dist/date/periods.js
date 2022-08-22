"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodType = void 0;
const date_fns_1 = require("date-fns");
function getPeriodType(from, to) {
    if ((0, date_fns_1.differenceInHours)(to, from) < 7) {
        return 'perMinute';
    }
    if ((0, date_fns_1.differenceInDays)(to, from) <= 7) {
        return 'perHour';
    }
    if ((0, date_fns_1.differenceInMonths)(to, from) < 6) {
        return 'perDay';
    }
    return 'perMonth';
}
exports.getPeriodType = getPeriodType;
//# sourceMappingURL=periods.js.map