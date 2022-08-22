"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginToEcr = void 0;
const exec_sh_1 = require("exec-sh");
async function loginToEcr({ ecrRegistry, region, }) {
    await (0, exec_sh_1.promise)([
        'aws',
        'ecr',
        'get-login-password',
        `--region ${region}`,
        '|',
        'docker',
        'login',
        '--username AWS',
        `--password-stdin ${ecrRegistry}`,
    ].join(' '));
}
exports.loginToEcr = loginToEcr;
//# sourceMappingURL=loginToEcr.js.map