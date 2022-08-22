"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solcastUtilityScaleForecastResponseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.solcastUtilityScaleForecastResponseSchema = joi_1.default.object({
    solcast_resource_id: joi_1.default.string().required(),
    lat: [joi_1.default.string(), joi_1.default.number()],
    lon: [joi_1.default.string(), joi_1.default.number()],
    timezone: joi_1.default.string(),
    timezone_offset: joi_1.default.number(),
    forecasted_on: joi_1.default.date().iso().required(),
    forecasts: joi_1.default.array()
        .required()
        .items(joi_1.default.object({
        pv_estimate: joi_1.default.number().required(),
        pv_estimate10: joi_1.default.number().required(),
        pv_estimate90: joi_1.default.number().required(),
        period_end: joi_1.default.date().iso().required(),
        period: joi_1.default.string()
            .required()
            .allow('PT5M', 'PT10M', 'PT15M', 'PT30M'),
    })),
});
//# sourceMappingURL=solcastUtilityScaleForecastSchema.js.map