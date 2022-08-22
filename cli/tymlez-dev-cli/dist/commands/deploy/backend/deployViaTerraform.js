"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployViaTerraform = void 0;
const assert_1 = __importDefault(require("assert"));
const date_fns_1 = require("date-fns");
const common_libs_1 = require("@tymlez/common-libs");
function deployViaTerraform({ gitSha, gitTag, tfToken, workspaceName, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const terraformApiHeaders = {
            Authorization: `Bearer ${tfToken}`,
            'Content-Type': 'application/vnd.api+json',
        };
        const workspace = yield (0, common_libs_1.findTerraformWorkspace)({
            workspaceName,
            headers: terraformApiHeaders,
        });
        (0, assert_1.default)(workspace, `Cannot find workspace: ${workspaceName}`);
        const entries = [
            {
                key: 'release_date',
                value: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'),
            },
            {
                key: 'git_sha',
                value: gitSha,
            },
            {
                key: 'git_tag',
                value: gitTag,
            },
        ];
        const updateResults = yield (0, common_libs_1.updateTerraformVariables)({
            workspaceId: workspace.id,
            entries,
            headers: terraformApiHeaders,
        });
        (0, common_libs_1.validateMaybeResults)({
            message: 'Failed to update terraform variables',
            inputs: entries.map((entry) => entry.key),
            results: updateResults,
        });
        const runResult = yield (0, common_libs_1.runTerraform)({
            workspaceId: workspace.id,
            headers: terraformApiHeaders,
            message: `Deploy from platform-middleware: ${gitSha}`,
        });
        console.log('Successfully run Terraform', {
            gitSha,
            resultId: runResult.id,
        });
    });
}
exports.deployViaTerraform = deployViaTerraform;
//# sourceMappingURL=deployViaTerraform.js.map