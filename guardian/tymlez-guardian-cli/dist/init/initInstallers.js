"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initInstallers = void 0;
const axios_1 = __importDefault(require("axios"));
async function initInstallers({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }) {
    const installers = ['Installer' /*, 'Installer2'*/];
    for (const installer of installers) {
        console.log('Initializing installer', installer);
        // It will initialize installer and associate tokens
        await axios_1.default.post(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/user/init/${installer}`, {}, {
            headers: {
                Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
            },
        });
    }
    return installers;
}
exports.initInstallers = initInstallers;
//# sourceMappingURL=initInstallers.js.map