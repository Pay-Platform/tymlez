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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apm = void 0;
/* eslint-disable no-process-env */
const dd_trace_1 = __importDefault(require("dd-trace"));
// eslint-disable-next-line no-process-env
if (process.env.DD_APM_ENABLED === 'true') {
    dd_trace_1.default.init({
        logInjection: true,
        tags: {
            app_name: process.env.APP_NAME || '*',
            client_name: process.env.CLIENT_NAME || 'tymlez'
        }
    }); // initialized in a different file to avoid hoisting.
}
exports.apm = dd_trace_1.default;
__exportStar(require("./datadog-module/datadog-module.module"), exports);
__exportStar(require("./datadog-module/metric.service"), exports);
//# sourceMappingURL=index.js.map