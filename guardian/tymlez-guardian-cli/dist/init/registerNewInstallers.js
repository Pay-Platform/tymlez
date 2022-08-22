"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNewInstallers = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
async function registerNewInstallers({ policyPackages, GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }) {
    await Promise.all(policyPackages.map(async (policyPackage) => {
        await registerNewInstaller({
            GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
            GUARDIAN_TYMLEZ_API_KEY,
            username: 'Installer',
            policyTag: policyPackage.policy.inputPolicyTag,
            installerInfo: {
                installerName: 'Installer 1',
                installerLicense: 'License 1',
            },
        });
    }));
}
exports.registerNewInstallers = registerNewInstallers;
async function registerNewInstaller({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, username, policyTag, installerInfo, }) {
    console.log('Registering new installer', { username, policyTag });
    await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/track-and-trace/register-installer`, {
        username,
        policyTag,
        installerInfo,
        schemaName: (0, config_1.config)().installerSchemaName,
    }, {
        headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
    });
}
//# sourceMappingURL=registerNewInstallers.js.map