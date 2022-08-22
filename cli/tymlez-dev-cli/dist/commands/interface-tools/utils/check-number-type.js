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
exports.checkNumberType = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const common_libs_1 = require("@tymlez/common-libs");
const getInterfaceFiles_1 = require("./getInterfaceFiles");
const { readFile } = fs_1.default.promises;
function checkNumberType(inputPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const tsFiles = (yield (0, getInterfaceFiles_1.getInterfaceFiles)(inputPath)).filter((file) => !file.includes('src/demo'));
        const limit = (0, p_limit_1.default)(5);
        const invalidTypesList = yield Promise.all(tsFiles.map((file) => limit(() => __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield readFile(file, 'utf8');
            const usedNumber = (0, common_libs_1.matchAll)(/^.+: number/m, fileContent);
            if (usedNumber.length > 0) {
                return usedNumber;
            }
            return undefined;
        }))));
        const errorInfos = (0, lodash_1.zip)(tsFiles, invalidTypesList).filter(([_, invalidTypes]) => !!invalidTypes && invalidTypes.length > 0);
        if (errorInfos.length > 0) {
            console.log(`Following files used 'number', which is not allowed. ` +
                `Please use more meaningful types instead, e.g., 'kWh', 'kW', or add a new type. \n${errorInfos
                    .map(([file]) => `  - ${file}`)
                    .join('\n')}`);
        }
        console.log('Pass: All usages of `number` type are valid, total files = %d', tsFiles.length);
    });
}
exports.checkNumberType = checkNumberType;
//# sourceMappingURL=check-number-type.js.map