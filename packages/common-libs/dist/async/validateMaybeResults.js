"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMaybeResults = void 0;
const lodash_1 = require("lodash");
const logMaybeErrors_1 = require("../log/logMaybeErrors");
function validateMaybeResults({ message, inputs, results, }) {
    (0, logMaybeErrors_1.logMaybeErrors)({ results, inputs, message });
    if ((0, lodash_1.some)(results, (result) => result instanceof Error)) {
        const errors = results
            .filter((result) => result instanceof Error)
            .map((result) => (result.message ? result.message : String(result)));
        throw new Error(`${message}\n${JSON.stringify((0, lodash_1.zip)(inputs, errors), undefined, 2)}`);
    }
}
exports.validateMaybeResults = validateMaybeResults;
//# sourceMappingURL=validateMaybeResults.js.map