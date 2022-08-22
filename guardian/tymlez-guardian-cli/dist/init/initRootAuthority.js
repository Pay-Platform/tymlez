"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRootAuthority = void 0;
const axios_1 = __importDefault(require("axios"));
async function initRootAuthority({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }) {
    await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/user/init/RootAuthority`, {}, {
        headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
    });
}
exports.initRootAuthority = initRootAuthority;
//# sourceMappingURL=initRootAuthority.js.map