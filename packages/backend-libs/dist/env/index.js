"use strict";
/* eslint-disable no-process-env */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvConfig = void 0;
const joi_1 = __importDefault(require("joi"));
function getEnvConfig(config) {
    const envVarsSchema = joi_1.default.object().keys(config).unknown();
    const { value: envVars, error } = envVarsSchema
        .prefs({ errors: { label: 'key' } })
        .validate(process.env);
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }
    return envVars;
}
exports.getEnvConfig = getEnvConfig;
//# sourceMappingURL=index.js.map