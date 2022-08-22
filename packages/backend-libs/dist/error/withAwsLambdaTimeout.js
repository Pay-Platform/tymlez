"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAwsLambdaTimeout = void 0;
const p_timeout_1 = __importStar(require("p-timeout"));
const pino_1 = require("../pino");
function withAwsLambdaTimeout({ func, functionName, timeoutBuffer = 6000, aboutToTimeoutBuffer = 12000, }) {
    return async (...args) => {
        const context = args[1];
        if (context?.getRemainingTimeInMillis) {
            const rawTimeout = context.getRemainingTimeInMillis();
            const timeout = rawTimeout - timeoutBuffer;
            if (timeout > 0) {
                const totalAboutToTimeoutBuffer = aboutToTimeoutBuffer + timeoutBuffer;
                context.aboutToTimeout = () => {
                    const remainingTime = context.getRemainingTimeInMillis();
                    if (remainingTime < totalAboutToTimeoutBuffer) {
                        return true;
                    }
                    return false;
                };
                pino_1.logger.info({
                    timeoutBuffer,
                    totalAboutToTimeoutBuffer,
                }, `${functionName}: Function will timeout in ${timeout}.`);
                try {
                    return await (0, p_timeout_1.default)(func(...args), timeout);
                }
                catch (ex) {
                    if (ex instanceof p_timeout_1.TimeoutError) {
                        pino_1.logger.error({ ex }, `${functionName}: Function has timed out %s`, {
                            remainingTime: context.getRemainingTimeInMillis(),
                        });
                    }
                    throw ex;
                }
            }
            pino_1.logger.warn(`${functionName}: No timeout set, timeout is ${timeout}, which is less than 0.`);
        }
        else {
            pino_1.logger.warn(`${functionName}: No timeout set, because context.getRemainingTimeInMillis() not available.`);
        }
        return await func(...args);
    };
}
exports.withAwsLambdaTimeout = withAwsLambdaTimeout;
//# sourceMappingURL=withAwsLambdaTimeout.js.map