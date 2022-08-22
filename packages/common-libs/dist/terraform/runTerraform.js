"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTerraform = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
async function runTerraform({ workspaceId, headers, message, }) {
    const { data: { data: result }, } = (await axios_1.default.post(`${constants_1.TERRAFORM_API_BASE_URL}/runs`, {
        data: {
            attributes: {
                'is-destroy': false,
                message,
            },
            type: 'runs',
            relationships: {
                workspace: {
                    data: {
                        type: 'workspaces',
                        id: workspaceId,
                    },
                },
            },
        },
    }, { headers }));
    return result;
}
exports.runTerraform = runTerraform;
//# sourceMappingURL=runTerraform.js.map