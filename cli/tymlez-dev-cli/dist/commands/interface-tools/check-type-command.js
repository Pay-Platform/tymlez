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
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = exports.handler = exports.desc = exports.command = void 0;
const check_date_type_1 = require("./utils/check-date-type");
const check_number_type_1 = require("./utils/check-number-type");
const command = 'check-type [path] [type]';
exports.command = command;
const desc = 'Validate usage of date type';
exports.desc = desc;
const builder = {
    path: {
        aliases: ['path'],
        type: 'string',
        required: false,
        desc: 'The path of the file to check',
    },
    type: {
        aliases: ['t'],
        type: 'string',
        choices: ['date', 'number', 'both'],
        required: true,
        desc: 'Data type to check',
        default: 'both',
    },
};
exports.builder = builder;
function handler({ path, type }) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirPath = path || process.env.INIT_CWD || __dirname;
        console.log(`Checking "${type}" type usage in ${dirPath}`);
        switch (type) {
            case 'date':
                yield (0, check_date_type_1.checkDateType)(dirPath);
                break;
            case 'number':
                yield (0, check_number_type_1.checkNumberType)(dirPath);
                break;
            case 'both':
                yield (0, check_date_type_1.checkDateType)(dirPath);
                yield (0, check_number_type_1.checkNumberType)(dirPath);
        }
    });
}
exports.handler = handler;
//# sourceMappingURL=check-type-command.js.map