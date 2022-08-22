"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDockerImage = void 0;
const exec_sh_1 = require("exec-sh");
async function buildDockerImage({ ecrRegistry, ecrRepository, imageTag, context = '.', dockerFile = 'Dockerfile', }) {
    const command = [
        'docker',
        'build',
        '-t',
        `${ecrRegistry}/${ecrRepository}`,
        '--build-arg',
        `GIT_SHA=${imageTag}`,
        '--progress=plain',
        '-f',
        dockerFile,
        context,
    ].join(' ');
    console.log('exec command', command);
    await (0, exec_sh_1.promise)(command);
}
exports.buildDockerImage = buildDockerImage;
//# sourceMappingURL=buildDockerImage.js.map