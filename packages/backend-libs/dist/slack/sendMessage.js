"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const webhook_1 = require("@slack/webhook");
async function sendMessage({ url, text, iconEmoji, }) {
    const webhook = new webhook_1.IncomingWebhook(url);
    return await webhook.send({
        text,
        icon_emoji: iconEmoji,
    });
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=sendMessage.js.map