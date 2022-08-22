"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const assert_1 = __importDefault(require("assert"));
const exec_sh_1 = require("exec-sh");
const aws_sdk_1 = require("aws-sdk");
const getBuildTimeConfig_1 = require("../getBuildTimeConfig");
const deployToGke_1 = require("./deployToGke");
const pushImages_1 = require("./pushImages");
const sts = new aws_sdk_1.STS();
async function deploy() {
    const { ENV, CLIENT_NAME, GIT_TAG } = process.env;
    console.log(process.cwd());
    (0, assert_1.default)(ENV, `ENV is missing`);
    (0, assert_1.default)(ENV !== 'local', `Cannot deploy to local`);
    (0, assert_1.default)(CLIENT_NAME, `CLIENT_NAME is missing`);
    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${CLIENT_NAME}-${ENV}`;
    (0, assert_1.default)(callerArn?.includes(`/ci-${fullEnv}`), `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`);
    const { GCP_PROJECT_ID, GCP_REGION, GKE_CLUSTER, GUARDIAN_TYMLEZ_API_KEY, DD_API_KEY } = await (0, getBuildTimeConfig_1.getBuildTimeConfig)({
        env: ENV,
        clientName: CLIENT_NAME,
    });
    (0, assert_1.default)(GCP_PROJECT_ID, `GCP_PROJECT_ID is missing`);
    (0, assert_1.default)(GCP_REGION, `GCP_REGION is missing`);
    (0, assert_1.default)(GKE_CLUSTER, `GKE_CLUSTER is missing`);
    const imageTag = GIT_TAG ?? Date.now().toString();
    const imageName = 'guardian-tymlez-service';
    await (0, exec_sh_1.promise)([
        'docker',
        'build',
        '-t',
        imageName,
        '-f Dockerfile',
        '--progress plain',
        '../..',
    ].join(' '));
    await (0, exec_sh_1.promise)(['gcloud', 'auth', 'configure-docker'].join(' '));
    await (0, pushImages_1.pushImages)({
        gcpProjectId: GCP_PROJECT_ID,
        imageTag,
        imageName,
    });
    await (0, deployToGke_1.deployToGke)({
        gkeCluster: GKE_CLUSTER,
        region: GCP_REGION,
        imageTag,
        gcpProjectId: GCP_PROJECT_ID,
        clientName: CLIENT_NAME,
        env: ENV,
        apiKey: GUARDIAN_TYMLEZ_API_KEY,
        datadogApiKey: DD_API_KEY || '',
    });
}
exports.deploy = deploy;
//# sourceMappingURL=index.js.map