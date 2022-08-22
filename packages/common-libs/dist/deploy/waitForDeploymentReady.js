"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForDeploymentReady = void 0;
const assert_1 = __importDefault(require("assert"));
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const p_retry_1 = __importDefault(require("p-retry"));
async function waitForDeploymentReady({ versionUrl, gitSha, gitTag, }) {
    console.log('Waiting for deployment ready.');
    await (0, p_retry_1.default)(async (attemptCount) => {
        console.log(`Attempt ${attemptCount}`);
        const { data: versionInfo } = await axios_1.default.get(versionUrl);
        (0, assert_1.default)(versionInfo, `Failed to get version`);
        if (!(0, lodash_1.isEqual)(versionInfo, {
            gitSha,
            gitTag,
        })) {
            const errorMessage = `Incorrect version : ${JSON.stringify(versionInfo)}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }, {
        forever: true,
        maxRetryTime: 500000,
        maxTimeout: 60000,
    });
    console.log({
        gitSha,
        gitTag,
    }, 'Deployment is ready');
}
exports.waitForDeploymentReady = waitForDeploymentReady;
//# sourceMappingURL=waitForDeploymentReady.js.map