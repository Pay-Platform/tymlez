"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLatestLongEnergies = void 0;
const common_libs_1 = require("@tymlez/common-libs");
const axios_1 = __importDefault(require("axios"));
const pino_1 = require("../pino");
const constants_1 = require("./constants");
const energyResponseSchema_1 = require("./energyResponseSchema");
async function fetchLatestLongEnergies({ requests, }) {
    return (0, common_libs_1.runAllSettled)(requests, async (requestOrError) => {
        if (requestOrError instanceof Error) {
            return requestOrError;
        }
        const { deviceId, apiKey } = requestOrError;
        const params = {
            'convert[energy]': 'kWh',
        };
        pino_1.logger.info(params, `Fetching latest long energy for ${deviceId}`);
        const { data } = await axios_1.default.get(`${constants_1.WATTWATCHERS_API_URL}/long-energy/${deviceId}/latest`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            params,
        });
        const dataWithMeterId = {
            ...data,
            meter_id: deviceId,
        };
        await energyResponseSchema_1.energyResponseItemSchema.validateAsync(dataWithMeterId, {
            abortEarly: false,
            allowUnknown: true,
        });
        return dataWithMeterId;
    });
}
exports.fetchLatestLongEnergies = fetchLatestLongEnergies;
//# sourceMappingURL=fetchLatestLongEnergies.js.map