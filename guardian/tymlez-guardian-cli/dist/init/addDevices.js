"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDevices = void 0;
const axios_1 = __importDefault(require("axios"));
const p_limit_1 = __importDefault(require("p-limit"));
const config_1 = require("./config");
async function addDevices({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, deviceInfos, }) {
    const limit = (0, p_limit_1.default)(1);
    await Promise.all(deviceInfos
        .filter((deviceInfo) => deviceInfo.deviceType === 'consumption')
        .map((deviceInfo) => limit(() => addDevice({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        username: 'Installer',
        policyTag: (0, config_1.config)().withPrefix('CET'),
        deviceInfo,
    }))));
    if (process.env.CLIENT_NAME !== 'uon') {
        await Promise.all(deviceInfos
            .filter((deviceInfo) => deviceInfo.deviceType === 'generation')
            .map((deviceInfo) => limit(() => addDevice({
            GUARDIAN_TYMLEZ_API_KEY,
            GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
            username: 'Installer',
            policyTag: 'TymlezCRU',
            deviceInfo,
        }))));
        await Promise.all(deviceInfos
            .filter((deviceInfo) => deviceInfo.deviceType === 'generation-forecast')
            .map((deviceInfo) => limit(() => addDevice({
            GUARDIAN_TYMLEZ_API_KEY,
            GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
            username: 'Installer',
            policyTag: 'TymlezCRUF',
            deviceInfo,
        }))));
    }
}
exports.addDevices = addDevices;
async function addDevice({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, username, policyTag, deviceInfo, }) {
    console.log('Adding device', { username, policyTag, deviceInfo });
    await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/track-and-trace/add-device`, {
        username,
        policyTag,
        deviceId: deviceInfo.deviceId,
        deviceInfo,
        deviceSchemaName: (0, config_1.config)().deviceSchemaName,
    }, {
        headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
    });
}
//# sourceMappingURL=addDevices.js.map