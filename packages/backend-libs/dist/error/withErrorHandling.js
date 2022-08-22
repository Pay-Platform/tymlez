"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withErrorHandling = void 0;
const common_libs_1 = require("@tymlez/common-libs");
const slack_1 = require("../slack");
const getErrorMessage_1 = require("./getErrorMessage");
const pino_1 = require("../pino");
function withErrorHandling({ func, functionName, logPrefix, getEventId, throwErrorDelay, slackWebhookUrl, }) {
    return async (...args) => {
        try {
            return await func(...args);
        }
        catch (err) {
            const eventId = getEventId(...args);
            const errorMessage = (0, getErrorMessage_1.getErrorMessage)({
                eventId,
                logPrefix,
                functionName,
                err,
            });
            pino_1.logger.error({ err }, errorMessage);
            if (slackWebhookUrl) {
                await (0, slack_1.trySendMessage)({
                    url: slackWebhookUrl,
                    text: errorMessage,
                });
            }
            else {
                pino_1.logger.info('Skip sending error to slack, because slackWebhookUrl is missing');
            }
            if (throwErrorDelay) {
                await (0, common_libs_1.waitFor)(throwErrorDelay);
            }
            throw err;
        }
    };
}
exports.withErrorHandling = withErrorHandling;
//# sourceMappingURL=withErrorHandling.js.map