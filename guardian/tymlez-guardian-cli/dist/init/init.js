"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const assert_1 = __importDefault(require("assert"));
const getBuildTimeConfig_1 = require("../getBuildTimeConfig");
const addDevices_1 = require("./addDevices");
const createPolicyPackages_1 = require("./createPolicyPackages");
const createTokens_1 = require("./createTokens");
const grantTokenKvcToInstallers_1 = require("./grantTokenKvcToInstallers");
const initInstallers_1 = require("./initInstallers");
const initRootAuthority_1 = require("./initRootAuthority");
const preflight_1 = require("./preflight");
const registerNewInstallers_1 = require("./registerNewInstallers");
async function init() {
    const { ENV, CLIENT_NAME } = process.env;
    (0, assert_1.default)(ENV, `ENV is missing`);
    (0, assert_1.default)(CLIENT_NAME, `CLIENT_NAME is missing`);
    const { GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, DEVICE_INFOS, } = await (0, getBuildTimeConfig_1.getBuildTimeConfig)({ env: ENV, clientName: CLIENT_NAME });
    await (0, preflight_1.preflightCheck)({
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        GUARDIAN_TYMLEZ_API_KEY,
    });
    console.log('Initial root authority');
    await (0, initRootAuthority_1.initRootAuthority)({
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        GUARDIAN_TYMLEZ_API_KEY,
    });
    console.log('Initial create tokens');
    const tokens = await (0, createTokens_1.createTokens)({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    });
    const policyPackages = await (0, createPolicyPackages_1.createPolicyPackages)({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        tokens,
    });
    const installers = await (0, initInstallers_1.initInstallers)({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    });
    await (0, grantTokenKvcToInstallers_1.grantTokenKycToInstallers)({
        tokens,
        installers,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        GUARDIAN_TYMLEZ_API_KEY,
    });
    await (0, registerNewInstallers_1.registerNewInstallers)({
        policyPackages,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        GUARDIAN_TYMLEZ_API_KEY,
    });
    (0, assert_1.default)(DEVICE_INFOS && DEVICE_INFOS.length > 0, `DEVICE_INFOS is missing`);
    await (0, addDevices_1.addDevices)({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        deviceInfos: DEVICE_INFOS,
    });
}
exports.init = init;
//# sourceMappingURL=init.js.map