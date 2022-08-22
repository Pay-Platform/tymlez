"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPolicyPackages = void 0;
const assert_1 = __importDefault(require("assert"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const lodash_1 = require("lodash");
const p_limit_1 = __importDefault(require("p-limit"));
const getPolicyFolders_1 = require("./getPolicyFolders");
const globAsync = (0, util_1.promisify)(glob_1.default);
const { readFile } = fs_1.default.promises;
async function createPolicyPackages({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, tokens, }) {
    // TODO: make it dynamic
    const templateData = {
        CET_TOKEN_ID: findToken(tokens, 'TYM_CET')?.tokenId,
        CRU_TOKEN_ID: findToken(tokens, 'TYM_CRU')?.tokenId,
        CRUF_TOKEN_ID: findToken(tokens, 'TYM_CRUF')?.tokenId,
        UON_CET_TOKEN_ID: findToken(tokens, 'UON_CET')?.tokenId,
    };
    const policyFolders = await (0, getPolicyFolders_1.getPolicyFolders)();
    const policyPackages = await Promise.all(policyFolders.map(async (folder) => {
        const files = await globAsync(`**/*.json`, { cwd: folder });
        const policyFiles = files.filter((file) => file === 'policy.json');
        (0, assert_1.default)(policyFiles.length === 1, `Number of ${folder}/policy.json is ${policyFiles.length}, expect 1`);
        const schemaFiles = files.filter((file) => file.startsWith('schemas/'));
        const tokenFiles = files.filter((file) => file.startsWith('tokens/'));
        return {
            policy: (await parsePolicyPackageFile({
                folder,
                file: policyFiles[0],
                templateData,
            })),
            schemas: await Promise.all(schemaFiles.map(async (file) => {
                const schema = await parsePolicyPackageFile({
                    folder,
                    file,
                    templateData,
                });
                (0, assert_1.default)(typeof schema.document !== 'string', `Expect schema document to be decoded, please run "npm run tools decode-schemas"`);
                return {
                    ...schema,
                    document: JSON.stringify(schema.document),
                };
            })),
            tokens: await Promise.all(tokenFiles.map(async (file) => parsePolicyPackageFile({ folder, file, templateData }))),
        };
    }));
    const limit = (0, p_limit_1.default)(1);
    return await Promise.all(policyPackages.map((policyPackage) => limit(async () => {
        console.log('Importing policy', policyPackage.policy.name);
        // fs.writeFileSync(
        //   'policy.json',
        //   JSON.stringify({ package: policyPackage, publish: true }, null, 4),
        // );
        const { data: importedPackage } = await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/policy/import-package`, { package: policyPackage, publish: true }, {
            headers: {
                Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
            },
        });
        console.log('Imported policy', policyPackage.policy.name);
        return importedPackage;
    })));
}
exports.createPolicyPackages = createPolicyPackages;
function findToken(tokens, tokenSymbol) {
    const matchToken = tokens.find((token) => token.tokenSymbol === tokenSymbol);
    // assert(matchToken, `Failed to find token ${tokenSymbol}`);
    return matchToken;
}
async function parsePolicyPackageFile({ folder, file, templateData, }) {
    const content = await readFile(path_1.default.join(folder, file), 'utf8');
    const compiledTemplate = (0, lodash_1.template)(content);
    return JSON.parse(compiledTemplate(templateData));
}
//# sourceMappingURL=createPolicyPackages.js.map