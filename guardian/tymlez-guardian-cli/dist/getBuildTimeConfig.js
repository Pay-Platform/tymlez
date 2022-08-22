"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildTimeConfig = void 0;
const assert_1 = __importDefault(require("assert"));
const getParameters_1 = require("./getParameters");
const getBuildTimeConfig = async ({ env, clientName, }) => {
    (0, assert_1.default)(env === 'local' || env === 'dev' || env === 'preprod' || env === 'prod', `Unsupported env: '${env}'.`);
    (0, assert_1.default)(clientName, `clientName is missing`);
    const fullEnv = `${clientName}-${env}`;
    const staticConfig = STATIC_CONFIGS[fullEnv];
    const [GCP_PROJECT_ID, GCP_REGION, GKE_CLUSTER, GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, DD_API_KEY,] = env !== 'local'
        ? await (0, getParameters_1.getParameters)([
            `/${env}/tymlez-platform/gcp-project-id`,
            `/${env}/tymlez-platform/gcp-region`,
            `/${env}/tymlez-platform/gke-cluster`,
            `/${env}/tymlez-platform/guardian-tymlez-api-key`,
            `/${env}/tymlez-platform/guardian-tymlez-service-base-url`,
            `/${env}/tymlez-platform/dd-api-key`,
        ])
        : [
            undefined,
            undefined,
            undefined,
            'tymlezApiKey1',
            'http://localhost:3010',
            'ddKey',
        ];
    (0, assert_1.default)(GUARDIAN_TYMLEZ_API_KEY, `GUARDIAN_TYMLEZ_API_KEY is missing`);
    (0, assert_1.default)(GUARDIAN_TYMLEZ_SERVICE_BASE_URL, `GUARDIAN_TYMLEZ_SERVICE_BASE_URL is missing`);
    return {
        ...staticConfig,
        GCP_PROJECT_ID,
        GCP_REGION,
        GKE_CLUSTER,
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        DD_API_KEY,
    };
};
exports.getBuildTimeConfig = getBuildTimeConfig;
// Refer to https://github.com/Tymlez/tymlez-platform/blob/main/services/cohort-middleware/tools/lib/deploy/bootstrap.js
const COHORT_DEVICE_INFOS = [
    {
        deviceId: 'DD54108399431',
        deviceLabel: 'Main',
        deviceType: 'consumption',
        siteName: 'main',
    },
    {
        deviceId: '6587-6532-5132-b217',
        deviceLabel: 'Solcast 1',
        deviceType: 'generation-forecast',
        siteName: 'main',
    },
];
const STATIC_CONFIGS = {
    'uon-local': {
        DEVICE_INFOS: COHORT_DEVICE_INFOS,
    },
    'uon-dev': {
        DEVICE_INFOS: COHORT_DEVICE_INFOS,
    },
    'uon-preprod': {
        DEVICE_INFOS: COHORT_DEVICE_INFOS,
    },
    'uon-prod': {
        DEVICE_INFOS: COHORT_DEVICE_INFOS,
    },
};
//# sourceMappingURL=getBuildTimeConfig.js.map