"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const common_libs_1 = require("@tymlez/common-libs");
function getErrorMessage({ err, logPrefix, eventId, functionName, }) {
    let errorMessage = `Error: ${new Date().toISOString()}: `;
    if (eventId) {
        errorMessage += `\`${eventId}\`: `;
    }
    errorMessage += `\`${logPrefix}\`: `;
    if (functionName) {
        errorMessage += `\`${functionName}\`: `;
    }
    errorMessage += `\n\`\`\`${err instanceof Error ? err.message : 'Unknown error'}\`\`\`\n\`\`\`${(0, common_libs_1.safeJsonStringify)(err)}\`\`\``;
    return errorMessage;
}
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=getErrorMessage.js.map