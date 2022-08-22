"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTerraformWorkspace = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
async function findTerraformWorkspace({ workspaceName, headers, }) {
    const { data: { data: workspaces }, } = (await axios_1.default.get(`${constants_1.TERRAFORM_API_BASE_URL}/organizations/${constants_1.TF_ORG}/workspaces`, { headers }));
    const workspace = workspaces.find((ws) => ws.attributes.name === workspaceName);
    return workspace;
}
exports.findTerraformWorkspace = findTerraformWorkspace;
//# sourceMappingURL=findTerraformWorkspace.js.map