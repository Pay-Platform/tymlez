"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trySendMessage = void 0;
const _1 = require(".");
async function trySendMessage(...args) {
    try {
        return await (0, _1.sendMessage)(...args);
    }
    catch (err) {
        console.warn('Failed to send message', args, err);
        return undefined;
    }
}
exports.trySendMessage = trySendMessage;
//# sourceMappingURL=trySendMessage.js.map