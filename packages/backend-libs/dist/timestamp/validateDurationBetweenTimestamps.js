"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDurationBetweenTimestamps = void 0;
const assert_1 = __importDefault(require("assert"));
const pino_1 = require("../pino");
const hasKnownErrorInMap_1 = require("./hasKnownErrorInMap");
function validateDurationBetweenTimestamps({ id, ascItems, expectedDuration, knownErrorsMap, hasKnownError, }) {
    for (let i = 0; i < ascItems.length - 1; ++i) {
        const item0 = ascItems[i];
        const item1 = ascItems[i + 1];
        const timeDiffMs = item1.timestamp.getTime() - item0.timestamp.getTime();
        if (hasKnownError) {
            if (hasKnownError({ item0, item1 })) {
                pino_1.logger.info(`For ${id}: skip checking time difference between ${item0.timestamp.toISOString()} and ` +
                    `${item1.timestamp.toISOString()} because of known error`);
                continue;
            }
        }
        if (knownErrorsMap) {
            if ((0, hasKnownErrorInMap_1.hasKnownErrorInMap)({ id, item0, item1, knownErrorsMap })) {
                pino_1.logger.info(`For ${id}: skip checking time difference between ${item0.timestamp.toISOString()} and ` +
                    `${item1.timestamp.toISOString()} because of known error`);
                continue;
            }
        }
        (0, assert_1.default)(timeDiffMs === expectedDuration, `For ${id}: time difference between ${item0.timestamp.toISOString()} and ` +
            `${item1.timestamp.toISOString()} is ${timeDiffMs}, ` +
            `does not equal to the duration of ${expectedDuration} ms`);
    }
}
exports.validateDurationBetweenTimestamps = validateDurationBetweenTimestamps;
//# sourceMappingURL=validateDurationBetweenTimestamps.js.map