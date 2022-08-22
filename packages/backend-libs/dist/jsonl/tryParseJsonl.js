"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseJsonl = void 0;
const parseJsonlInternal_1 = require("./parseJsonlInternal");
async function tryParseJsonl({ schema, stream, }) {
    const { results } = await (0, parseJsonlInternal_1.parseJsonlInternal)({ stream, schema });
    return results;
}
exports.tryParseJsonl = tryParseJsonl;
//# sourceMappingURL=tryParseJsonl.js.map