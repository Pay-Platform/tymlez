"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAll = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
async function runAll(inputs, callback, concurrency = 8) {
    const limit = (0, p_limit_1.default)(concurrency);
    return Promise.all(inputs.map((input, index) => limit(async () => {
        return callback(input, index);
    })));
}
exports.runAll = runAll;
//# sourceMappingURL=runAll.js.map