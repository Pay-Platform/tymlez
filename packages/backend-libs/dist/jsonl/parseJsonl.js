"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonl = void 0;
const common_libs_1 = require("@tymlez/common-libs");
const parseJsonlInternal_1 = require("./parseJsonlInternal");
async function parseJsonl({ stream, schema, }) {
    const { lines, results } = await (0, parseJsonlInternal_1.parseJsonlInternal)({ stream, schema });
    (0, common_libs_1.validateMaybeResults)({
        message: 'Failed to parse JSONL data',
        inputs: lines,
        results,
    });
    return results;
}
exports.parseJsonl = parseJsonl;
//# sourceMappingURL=parseJsonl.js.map