"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicyFolders = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const { readdir } = fs_1.default.promises;
async function getPolicyFolders() {
    const policiesDir = path_1.default.join(__dirname, 'policies', process.env.CLIENT_NAME?.toLocaleLowerCase() || 'tymlez');
    return (await readdir(policiesDir, { withFileTypes: true }))
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path_1.default.join(policiesDir, dirent.name));
}
exports.getPolicyFolders = getPolicyFolders;
//# sourceMappingURL=getPolicyFolders.js.map