"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = void 0;
const assert_1 = __importDefault(require("assert"));
const p_timeout_1 = __importDefault(require("p-timeout"));
function withTimeout({ func, functionName, rawTimeout, timeBuffer = 6000, }) {
    const timeout = rawTimeout - timeBuffer;
    (0, assert_1.default)(timeout > 0, `${functionName}: timeout is ${timeout} ms, expect larger than 0.`);
    return async (...args) => {
        return await (0, p_timeout_1.default)(func(...args), timeout);
    };
}
exports.withTimeout = withTimeout;
//# sourceMappingURL=withTimeout.js.map