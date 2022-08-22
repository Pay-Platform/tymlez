"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTerraformVariables = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
async function findTerraformVariables({ workspaceId, keys, headers, }) {
    const { data: { data: variables }, } = (await axios_1.default.get(`${constants_1.TERRAFORM_API_BASE_URL}/workspaces/${workspaceId}/vars`, { headers }));
    return keys.map((key) => variables.find((variable) => variable.attributes.key === key));
}
exports.findTerraformVariables = findTerraformVariables;
//# sourceMappingURL=findTerraformVariables.js.map