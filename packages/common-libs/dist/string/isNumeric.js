"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
function isNumeric(value) {
    if (typeof value === 'number') {
        return !isNaN(value);
    }
    if (typeof value === 'string') {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }
    return false;
}
exports.isNumeric = isNumeric;
//# sourceMappingURL=isNumeric.js.map