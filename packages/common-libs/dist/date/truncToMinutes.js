"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncToMinutes = void 0;
const assert_1 = __importDefault(require("assert"));
const date_fns_1 = require("date-fns");
function truncToMinutes(date, boundary = 1) {
    (0, assert_1.default)(boundary > 0, `boundary is ${boundary}, expect larger than 0.`);
    (0, assert_1.default)(Number.isInteger(boundary), `boundary is ${boundary}, expect to be integer.`);
    return (0, date_fns_1.roundToNearestMinutes)((0, date_fns_1.subMilliseconds)(date, (0, date_fns_1.minutesToMilliseconds)(boundary / 2)), { nearestTo: boundary });
}
exports.truncToMinutes = truncToMinutes;
//# sourceMappingURL=truncToMinutes.js.map