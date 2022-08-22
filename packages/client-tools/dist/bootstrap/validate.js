"use strict";
/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const path_1 = __importDefault(require("path"));
const backend_libs_1 = require("@tymlez/backend-libs");
const validateBootstrap_1 = require("./validateBootstrap");
async function validate({ filePath }) {
    const bootstrap = require(path_1.default.resolve(filePath));
    await (0, validateBootstrap_1.validateBootstrap)({ bootstrap });
    backend_libs_1.logger.info(`Bootstrap file: '${filePath}' is valid`);
}
exports.validate = validate;
//# sourceMappingURL=validate.js.map