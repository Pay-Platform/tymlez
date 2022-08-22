"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonlInternal = void 0;
const common_libs_1 = require("@tymlez/common-libs");
async function parseJsonlInternal({ stream, schema, }) {
    const content = await (0, common_libs_1.readStreamAsync)(stream);
    const lines = content
        .split(/(?:\r\n|\r|\n)/g)
        .filter((line) => !!line.trim());
    const results = await (0, common_libs_1.runAllSettled)(lines, async (line) => {
        const lineJson = JSON.parse(line);
        await schema.validateAsync(lineJson, {
            abortEarly: false,
            allowUnknown: true,
        });
        return lineJson;
    });
    return { lines, results };
}
exports.parseJsonlInternal = parseJsonlInternal;
//# sourceMappingURL=parseJsonlInternal.js.map