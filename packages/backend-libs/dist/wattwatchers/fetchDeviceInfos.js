"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSchema = exports.fetchDeviceInfos = void 0;
const axios_1 = __importDefault(require("axios"));
const joi_1 = __importDefault(require("joi"));
const common_libs_1 = require("@tymlez/common-libs");
const pino_1 = require("../pino");
const constants_1 = require("./constants");
async function fetchDeviceInfos({ devices, }) {
    return (0, common_libs_1.runAllSettled)(devices, async ({ deviceId, apiKey }) => {
        pino_1.logger.info({ deviceId }, 'Fetching device info ');
        const { data } = await axios_1.default.get(`${constants_1.WATTWATCHERS_API_URL}/devices/${deviceId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        await exports.deviceSchema.validateAsync(data, {
            abortEarly: false,
            allowUnknown: true,
        });
        return data;
    });
}
exports.fetchDeviceInfos = fetchDeviceInfos;
exports.deviceSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    channels: joi_1.default.array()
        .required()
        .items(joi_1.default.object({
        id: joi_1.default.string().required(),
        label: joi_1.default.string().required(),
        categoryId: joi_1.default.number().required(),
        categoryLabel: joi_1.default.string().required(),
    })),
});
//# sourceMappingURL=fetchDeviceInfos.js.map