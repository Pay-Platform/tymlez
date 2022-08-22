"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLongEnergy = void 0;
/**
 * Refer to https://docs.wattwatchers.com.au/api/v3/endpoints.html#get-long-energydevice-id
 *
 * fromTs is inclusive
 * toTs is exclusive
 */
const common_libs_1 = require("@tymlez/common-libs");
const axios_1 = __importDefault(require("axios"));
const pino_1 = require("../pino");
const energyResponseSchema_1 = require("./energyResponseSchema");
const constants_1 = require("./constants");
async function fetchLongEnergy({ deviceId, apiKey, fromDate, toDate, }) {
    const fromTs = (0, common_libs_1.toTimestampSec)(fromDate);
    const toTs = toDate ? (0, common_libs_1.toTimestampSec)(toDate) : undefined;
    const params = {
        'convert[energy]': 'kWh',
        fromTs,
        ...(toTs
            ? {
                toTs,
            }
            : undefined),
    };
    pino_1.logger.info({
        ...params,
        fromDate,
        toDate,
    }, `Fetching long energy for ${deviceId}`);
    const { data } = await axios_1.default.get(`${constants_1.WATTWATCHERS_API_URL}/long-energy/${deviceId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        params,
    });
    const dataWithMeterId = data.map((item) => ({
        ...item,
        meter_id: deviceId,
    }));
    await energyResponseSchema_1.energyResponseSchema.validateAsync(dataWithMeterId, {
        abortEarly: false,
        allowUnknown: true,
    });
    return dataWithMeterId;
}
exports.fetchLongEnergy = fetchLongEnergy;
//# sourceMappingURL=fetchLongEnergy.js.map