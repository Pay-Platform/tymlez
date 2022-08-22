"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHelmDeploy = void 0;
const assert_1 = __importDefault(require("assert"));
const exec_sh_1 = require("exec-sh");
const path_1 = require("path");
async function runHelmDeploy(args) {
    const { ddKey = '', apiKey = 'apiKey', gcpProjectId = 'gcpProjectId', imageTag = 'latest', dryRun = true, clientName = 'tymlez' } = args;
    console.log("Run Helm", args);
    await (0, exec_sh_1.promise)(['helm', 'version'].join(' '));
    if (!dryRun) {
        // validate 
        (0, assert_1.default)(apiKey !== 'apiKey', 'Please provide valid apiKey');
        (0, assert_1.default)(gcpProjectId !== 'gcpProjectId', 'Please provide valid gcpProjectId');
    }
    console.log('Charts location', __dirname, (0, path_1.resolve)(__dirname, 'charts/guardian-tymlez-service'));
    await (0, exec_sh_1.promise)(['helm', 'dependency', 'update'].join(' '), {
        cwd: (0, path_1.resolve)(__dirname, 'charts/guardian-tymlez-service'),
    });
    await (0, exec_sh_1.promise)([
        'helm',
        'upgrade',
        '--install',
        '--debug',
        `tymlez-guardian-${process.env.ENV}`,
        '.',
        `--set-string image.repository="asia.gcr.io/${gcpProjectId}/guardian-tymlez-service"`,
        `--set-string image.tag="${imageTag}"`,
        `--set-string configmap.datadog.DD_API_KEY="${ddKey}"`,
        `--set-string configmap.data.DEPLOY_VERSION="${imageTag}"`,
        `--set-string configmap.data.ENV_NAME="${process.env.ENV}"`,
        `--set-string configmap.data.CLIENT_NAME="${clientName}"`,
        `--set-string configmap.data.GUARDIAN_TYMLEZ_API_KEY="${apiKey}"`,
        dryRun ? '--dry-run' : '',
    ].join(' '), {
        cwd: (0, path_1.resolve)(__dirname, 'charts/guardian-tymlez-service'),
    });
}
exports.runHelmDeploy = runHelmDeploy;
//# sourceMappingURL=heml.js.map