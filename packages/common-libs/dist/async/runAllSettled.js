"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllSettled = void 0;
const assert_1 = require("assert");
const p_limit_1 = __importDefault(require("p-limit"));
const safeJsonStringify_1 = require("../json/safeJsonStringify");
async function runAllSettled(inputs, callback, concurrency = 8) {
    const limit = (0, p_limit_1.default)(concurrency);
    const results = await Promise.allSettled(inputs.map((input, index) => limit(async () => {
        if (input instanceof Error) {
            return input;
        }
        return callback(input, index);
    })));
    return results.map((result) => {
        if (result.status === 'rejected') {
            if (result.reason instanceof Error) {
                return result.reason;
            }
            // https://github.com/facebook/jest/issues/7547
            if (result.reason instanceof assert_1.AssertionError) {
                return new Error(result.reason.message);
            }
            return new Error(`Unknown error.\n${(0, safeJsonStringify_1.safeJsonStringify)(result.reason)}`);
        }
        return result.value;
    });
}
exports.runAllSettled = runAllSettled;
//# sourceMappingURL=runAllSettled.js.map