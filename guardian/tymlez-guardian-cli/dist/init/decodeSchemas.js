"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSchemas = void 0;
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = require("path");
const util_1 = require("util");
const getPolicyFolders_1 = require("./getPolicyFolders");
const globAsync = (0, util_1.promisify)(glob_1.default);
const { readFile, writeFile } = fs_1.default.promises;
async function decodeSchemas() {
    const policyFolders = await (0, getPolicyFolders_1.getPolicyFolders)();
    await Promise.all(policyFolders.map(async (folder) => {
        const files = await globAsync(`**/*.json`, { cwd: folder });
        const schemaFiles = files.filter((file) => file.startsWith('schemas/'));
        await Promise.all(schemaFiles.map(async (schemaFile) => {
            const schema = JSON.parse(await readFile((0, path_1.join)(folder, schemaFile), 'utf-8'));
            if (typeof schema.document !== 'string') {
                console.log(`Skip decoding of ${schemaFile} because it is already decoded`);
                return;
            }
            console.log('Decoding', schemaFile);
            const newSchema = {
                ...schema,
                document: JSON.parse(schema.document),
            };
            await writeFile((0, path_1.join)(folder, schemaFile), JSON.stringify(newSchema, undefined, 2));
        }));
    }));
}
exports.decodeSchemas = decodeSchemas;
//# sourceMappingURL=decodeSchemas.js.map