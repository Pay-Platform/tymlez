"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genReqId = void 0;
const crypto_1 = require("crypto");
const genReqId = (request) => {
    return request.headers['x-correlation-id']?.toString()
        ? request.headers['x-correlation-id'].toString()
        : (0, crypto_1.randomUUID)();
};
exports.genReqId = genReqId;
//# sourceMappingURL=genReqId.js.map