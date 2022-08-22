"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMaybeErrors = void 0;
const lodash_1 = require("lodash");
const safeJsonStringify_1 = require("../json/safeJsonStringify");
function logMaybeErrors({ message, inputs, results, }) {
    if (!(0, lodash_1.some)(results, (result) => result instanceof Error)) {
        return;
    }
    if (inputs.length === results.length) {
        console.error(message, `results count: ${results.length}`, (0, safeJsonStringify_1.safeJsonStringify)((0, lodash_1.zip)(inputs, results)
            .filter((s) => s[1] instanceof Error)
            .map(([input, error]) => {
            return {
                input,
                errorMessage: error.message ? error.message : error.toString(),
                error,
            };
        }), 2));
    }
    else {
        console.error(message, `inputs count: ${inputs.length}, results count: ${results.length}`, inputs, (0, safeJsonStringify_1.safeJsonStringify)(results.map((result) => {
            if (!(result instanceof Error)) {
                return undefined;
            }
            const error = result;
            return {
                errorMessage: error.message ? error.message : error.toString(),
                error,
            };
        }), 2));
    }
}
exports.logMaybeErrors = logMaybeErrors;
//# sourceMappingURL=logMaybeErrors.js.map