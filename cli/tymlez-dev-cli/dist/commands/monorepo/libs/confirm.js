"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = void 0;
// eslint-disable-next-line import/no-import-module-exports
const readline_1 = __importDefault(require("readline"));
/**
 *
 * @param {string} query
 * @returns {Promise<string>}
 */
function confirm(query) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => 
    // eslint-disable-next-line no-promise-executor-return
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
}
exports.confirm = confirm;
module.exports = { confirm };
//# sourceMappingURL=confirm.js.map