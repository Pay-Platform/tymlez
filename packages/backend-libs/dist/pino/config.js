"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerConfigs = void 0;
const joi_1 = __importDefault(require("joi"));
const env_1 = require("../env");
exports.loggerConfigs = (0, env_1.getEnvConfig)({
    LOG_LEVEL: joi_1.default
        .string()
        .valid('debug', 'info', 'error')
        .optional()
        .default('info'),
    NODE_ENV: joi_1.default
        .string()
        .valid('production', 'development', 'local', 'test')
        .optional()
        .default('local'),
});
//# sourceMappingURL=config.js.map