"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function createTokens({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }) {
    const existingTokens = await getExistingTokens({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    });
    const INIT_TOKENS = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, `./policies/${process.env.CLIENT_NAME}/tokens.json`), 'utf8'));
    const pendingTokens = INIT_TOKENS.filter((initToken) => !existingTokens.some((existingToken) => existingToken.tokenSymbol === initToken.tokenSymbol));
    console.log('Creating tokens', pendingTokens.map((token) => token.tokenSymbol));
    for await (const token of pendingTokens) {
        await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens/create`, token, {
            headers: {
                Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
            },
        });
        console.log('Token created', token.tokenSymbol);
    }
    return (await getExistingTokens({
        GUARDIAN_TYMLEZ_API_KEY,
        GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    })).filter((token) => INIT_TOKENS.some((initToken) => initToken.tokenSymbol === token.tokenSymbol));
}
exports.createTokens = createTokens;
async function getExistingTokens({ GUARDIAN_TYMLEZ_SERVICE_BASE_URL, GUARDIAN_TYMLEZ_API_KEY, }) {
    return (await axios_1.default.get(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens`, {
        headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
    })).data;
}
//# sourceMappingURL=createTokens.js.map