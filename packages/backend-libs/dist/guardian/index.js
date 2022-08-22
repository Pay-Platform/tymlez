"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGuardianRequest = exports.getGuardianAxios = void 0;
const assert_1 = __importDefault(require("assert"));
const axios_1 = __importDefault(require("axios"));
const getGuardianAxios = ({ 
// eslint-disable-next-line no-process-env
GUARDIAN_TYMLEZ_SERVICE_BASE_URL = process.env
    .GUARDIAN_TYMLEZ_SERVICE_BASE_URL, 
// eslint-disable-next-line no-process-env
GUARDIAN_TYMLEZ_SERVICE_API_KEY = process.env.GUARDIAN_TYMLEZ_SERVICE_API_KEY, } = {}) => {
    (0, assert_1.default)(GUARDIAN_TYMLEZ_SERVICE_BASE_URL, `GUARDIAN_TYMLEZ_SERVICE_BASE_URL is missing`);
    (0, assert_1.default)(GUARDIAN_TYMLEZ_SERVICE_API_KEY, `GUARDIAN_TYMLEZ_SERVICE_API_KEY is missing`);
    return axios_1.default.create({
        baseURL: GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
        headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_SERVICE_API_KEY}`,
        },
    });
};
exports.getGuardianAxios = getGuardianAxios;
async function makeGuardianRequest(endpoint, method, payload) {
    const instance = (0, exports.getGuardianAxios)();
    const { data } = await instance.request({
        url: endpoint,
        method,
        data: payload,
    });
    return data;
}
exports.makeGuardianRequest = makeGuardianRequest;
//# sourceMappingURL=index.js.map