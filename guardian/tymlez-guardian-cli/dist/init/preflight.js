"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preflightCheck = void 0;
const axios_1 = __importDefault(require("axios"));
async function preflightCheck({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }) {
    try {
        console.log('Preflight check', GUARDIAN_TYMLEZ_SERVICE_BASE_URL);
        const { data } = await axios_1.default.get(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/info`, {
            headers: {
                Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
            },
        });
        console.log('Preflight check: OK', data);
    }
    catch (err) {
        console.error('Tymlez API is not working at ', GUARDIAN_TYMLEZ_SERVICE_BASE_URL);
        process.exit(1);
    }
}
exports.preflightCheck = preflightCheck;
//# sourceMappingURL=preflight.js.map