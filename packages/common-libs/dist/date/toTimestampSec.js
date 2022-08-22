"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimestampSec = void 0;
function toTimestampSec(dateOrMs) {
    if (dateOrMs instanceof Date) {
        return Math.round(dateOrMs.getTime() / 1000);
    }
    const ms = dateOrMs;
    return Math.round(ms / 1000);
}
exports.toTimestampSec = toTimestampSec;
//# sourceMappingURL=toTimestampSec.js.map