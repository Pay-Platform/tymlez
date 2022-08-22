"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerraformVariables = void 0;
const assert_1 = __importDefault(require("assert"));
const lodash_1 = require("lodash");
const async_1 = require("../async");
const findTerraformVariables_1 = require("./findTerraformVariables");
const updateTerraformVariable_1 = require("./updateTerraformVariable");
async function updateTerraformVariables({ workspaceId, entries, headers, }) {
    const variables = await (0, findTerraformVariables_1.findTerraformVariables)({
        workspaceId,
        keys: entries.map((entry) => entry.key),
        headers,
    });
    return (0, async_1.runAllSettled)((0, lodash_1.zip)(entries, variables), async ([entry, variable]) => {
        (0, assert_1.default)(entry, `entry is missing`);
        (0, assert_1.default)(variable, `Cannot find variable for ${entry.key}`);
        await (0, updateTerraformVariable_1.updateTerraformVariable)({
            terraformVar: variable,
            value: entry.value,
            headers,
        });
    });
}
exports.updateTerraformVariables = updateTerraformVariables;
//# sourceMappingURL=updateTerraformVariables.js.map