"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncRetry = void 0;
const p_retry_1 = __importDefault(require("p-retry"));
function asyncRetry(input, options) {
    return (0, p_retry_1.default)(input, options);
}
exports.asyncRetry = asyncRetry;
//# sourceMappingURL=async-retry.js.map