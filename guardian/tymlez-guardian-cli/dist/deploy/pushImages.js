"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushImages = void 0;
const exec_sh_1 = require("exec-sh");
async function pushImages({ gcpProjectId, imageTag, imageName, }) {
    console.log('Pushing images to ', { gcpProjectId, imageTag });
    await pushImage({
        gcpProjectId,
        imageName,
        imageTag,
    });
}
exports.pushImages = pushImages;
async function pushImage({ gcpProjectId, imageName, imageTag, }) {
    await (0, exec_sh_1.promise)([
        `docker`,
        `tag`,
        imageName,
        `asia.gcr.io/${gcpProjectId}/${imageName}:${imageTag}`,
    ].join(' '));
    await (0, exec_sh_1.promise)([
        `docker`,
        `push`,
        `asia.gcr.io/${gcpProjectId}/${imageName}:${imageTag}`,
    ].join(' '));
    await (0, exec_sh_1.promise)([
        `docker`,
        `tag`,
        imageName,
        `asia.gcr.io/${gcpProjectId}/${imageName}:latest`,
    ].join(' '));
    await (0, exec_sh_1.promise)([`docker`, `push`, `asia.gcr.io/${gcpProjectId}/${imageName}:latest`].join(' '));
}
//# sourceMappingURL=pushImages.js.map