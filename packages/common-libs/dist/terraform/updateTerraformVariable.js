"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerraformVariable = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
async function updateTerraformVariable({ terraformVar, value, headers, }) {
    console.log(`Updating Terraform variable ${terraformVar.attributes.key} from ${terraformVar.attributes.value}` +
        'to %s', !terraformVar.attributes.sensitive ? value : '<sensitive value>');
    await axios_1.default.patch(`${constants_1.TERRAFORM_API_BASE_URL}/vars/${terraformVar.id}`, {
        data: {
            id: terraformVar.id,
            attributes: {
                key: terraformVar.attributes.key,
                value,
            },
        },
    }, { headers });
}
exports.updateTerraformVariable = updateTerraformVariable;
//# sourceMappingURL=updateTerraformVariable.js.map