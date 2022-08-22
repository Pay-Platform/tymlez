"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carbonEmissionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.carbonEmissionSchema = joi_1.default.object({
    regionid: joi_1.default.string().required(),
    settlement_date: joi_1.default.date().iso().required(),
    energy: joi_1.default.number(),
    emission: joi_1.default.number(),
    factor: joi_1.default.number(),
});
//# sourceMappingURL=carbonEmissionSchema.js.map