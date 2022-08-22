"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = void 0;
function waitFor(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.waitFor = waitFor;
//# sourceMappingURL=wait-for.js.map