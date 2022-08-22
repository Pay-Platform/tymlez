"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantTokenKycToInstallers = void 0;
const axios_1 = __importDefault(require("axios"));
async function grantTokenKycToInstallers({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, installers, tokens, }) {
    for (const token of tokens) {
        for (const installer of installers) {
            console.log('Granting KYC', { tokenId: token.tokenId, installer });
            await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens/user-kyc`, {
                tokenId: token.tokenId,
                username: installer,
                value: true,
            }, {
                headers: {
                    Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
                },
            });
        }
    }
}
exports.grantTokenKycToInstallers = grantTokenKycToInstallers;
//# sourceMappingURL=grantTokenKvcToInstallers.js.map