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
exports.checkDateType = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const common_libs_1 = require("@tymlez/common-libs");
const getInterfaceFiles_1 = require("./getInterfaceFiles");
const { readFile } = fs_1.default.promises;
function checkDateType(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const tsFiles = (yield (0, getInterfaceFiles_1.getInterfaceFiles)(inputPath)).filter((file) => !file.includes('src/demo'));
        yield checkTimestampType(tsFiles);
        yield checkTimeSpanType(tsFiles);
        console.log('Pass: All usages of date types are valid, total file %d', tsFiles.length);
    });
}
exports.checkDateType = checkDateType;
function checkTimestampType(tsFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = (0, p_limit_1.default)(5);
        const invalidTypesList = yield Promise.all(tsFiles.map((file) => limit(() => __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield readFile(file, 'utf8');
            const usedDate = (0, common_libs_1.matchAll)(/^.+: Date/m, fileContent);
            if (usedDate.length > 0) {
                return usedDate;
            }
            const usedTimestampSec = (0, common_libs_1.matchAll)(/^.+: ITimestampSec/m, fileContent);
            if (usedTimestampSec.length > 0) {
                return usedTimestampSec;
            }
            return undefined;
        }))));
        const errorInfos = (0, lodash_1.zip)(tsFiles, invalidTypesList).filter(([_, invalidTypes]) => !!invalidTypes && invalidTypes.length > 0);
        if (errorInfos.length > 0) {
            throw new Error(`Following files used 'Date' or 'ITimestampSec', which is not allowed. ` +
                `Please use 'ITimestampMsec' instead. \n${errorInfos
                    .map(([file]) => `  - ${file}`)
                    .join('\n')}`);
        }
    });
}
function checkTimeSpanType(tsFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = (0, p_limit_1.default)(5);
        const invalidTypesList = yield Promise.all(tsFiles.map((file) => limit(() => __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield readFile(file, 'utf8');
            const usedTimeSpanSec = (0, common_libs_1.matchAll)(/^.+: ITimeSpanSec/m, fileContent);
            if (usedTimeSpanSec.length > 0) {
                return usedTimeSpanSec;
            }
            return undefined;
        }))));
        const errorInfos = (0, lodash_1.zip)(tsFiles, invalidTypesList).filter(([_, invalidTypes]) => !!invalidTypes && invalidTypes.length > 0);
        if (errorInfos.length > 0) {
            throw new Error(`Following files used 'ITimeSpanSec', which is not allowed. ` +
                `Please use 'ITimeSpanMsec' instead. \n${errorInfos
                    .map(([file]) => `  - ${file}`)
                    .join('\n')}`);
        }
    });
}
//# sourceMappingURL=check-date-type.js.map