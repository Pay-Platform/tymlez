"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployToGke = void 0;
const exec_sh_1 = require("exec-sh");
const heml_1 = require("./heml");
async function deployToGke({ clientName, env, gcpProjectId, gkeCluster, region, imageTag, apiKey, datadogApiKey, }) {
    // Make sure w don't deploy to the wrong GCP project
    const fullEnv = `${clientName}-${env}`;
    await (0, exec_sh_1.promise)([
        'gcloud',
        'config',
        'get-value',
        'project',
        '|',
        'grep',
        fullEnv,
        '||',
        `{ echo Invalid GCP project, expect ${fullEnv}; false; }`,
    ].join(' '));
    await (0, exec_sh_1.promise)('gcloud info');
    await (0, exec_sh_1.promise)(`gcloud container clusters get-credentials ${gkeCluster} --region ${region} --project ${gcpProjectId}`);
    console.log('Using GKE Cluster', { gkeCluster, region });
    await (0, heml_1.runHelmDeploy)({
        dryRun: false,
        gcpProjectId,
        apiKey,
        imageTag,
        ddKey: datadogApiKey,
        clientName,
    });
}
exports.deployToGke = deployToGke;
//# sourceMappingURL=deployToGke.js.map