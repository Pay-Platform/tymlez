"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushDockerImageToEcr = void 0;
const exec_sh_1 = require("exec-sh");
async function pushDockerImageToEcr({ ecrRegistry, ecrRepository, imageTag, }) {
    await (0, exec_sh_1.promise)(['docker', 'push', `${ecrRegistry}/${ecrRepository}:latest`].join(' '));
    if (imageTag !== 'latest') {
        await (0, exec_sh_1.promise)([
            'docker',
            'tag',
            `${ecrRegistry}/${ecrRepository}:latest`,
            `${ecrRegistry}/${ecrRepository}:${imageTag}`,
        ].join(' '));
        await (0, exec_sh_1.promise)(['docker', 'push', `${ecrRegistry}/${ecrRepository}:${imageTag}`].join(' '));
    }
}
exports.pushDockerImageToEcr = pushDockerImageToEcr;
//# sourceMappingURL=pushDockerImageToEcr.js.map