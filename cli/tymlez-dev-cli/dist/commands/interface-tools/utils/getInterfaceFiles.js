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
exports.getInterfaceFiles = void 0;
/* eslint-disable no-param-reassign */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs_1.default.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if (fs_1.default.statSync(`${dirPath}/${file}`).isDirectory()) {
            arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path_1.default.join(dirPath, '/', file));
        }
    });
    return arrayOfFiles;
};
function getInterfaceFiles(inputPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const list = getAllFiles(path_1.default.join(inputPath, 'src'), []);
        return list.filter((x) => x.includes('.ts'));
    });
}
exports.getInterfaceFiles = getInterfaceFiles;
//# sourceMappingURL=getInterfaceFiles.js.map