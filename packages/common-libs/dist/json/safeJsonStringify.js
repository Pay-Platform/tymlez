"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonStringify = void 0;
function safeJsonStringify(value, space, ignoredKeys) {
    return JSON.stringify(value, getCircularReplacer(ignoredKeys), space);
}
exports.safeJsonStringify = safeJsonStringify;
function getCircularReplacer(ignoredKeys) {
    const seen = new WeakSet();
    return (key, value) => {
        if (ignoredKeys && ignoredKeys.indexOf(key) > -1) {
            if (typeof value === 'object' && value !== null) {
                return Object.keys(value);
            }
            return typeof value;
        }
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}
//# sourceMappingURL=safeJsonStringify.js.map