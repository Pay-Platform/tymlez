"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.energyResponseSchema = exports.energyResponseItemSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.energyResponseItemSchema = joi_1.default.object({
    meter_id: joi_1.default.string().required(),
    timestamp: joi_1.default.number().required(),
    duration: joi_1.default.number().required(),
    eReactiveKwh: joi_1.default.array().required().items(joi_1.default.number()),
    eRealKwh: joi_1.default.array().required().items(joi_1.default.number()),
});
exports.energyResponseSchema = joi_1.default.array().items(exports.energyResponseItemSchema);
//# sourceMappingURL=energyResponseSchema.js.map