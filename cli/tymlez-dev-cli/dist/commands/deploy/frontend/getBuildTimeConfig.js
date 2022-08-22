"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildTimeConfig = void 0;
const assert_1 = __importDefault(require("assert"));
const common_libs_1 = require("@tymlez/common-libs");
const getBuildTimeConfig = ({ env, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, assert_1.default)(env === 'local' || env === 'dev' || env === 'preprod' || env === 'prod', `Unsupported env: '${env}'.`);
    const [CLOUDFRONT_DISTRIBUTION_ID] = env !== 'local'
        ? yield (0, common_libs_1.getParameters)([
            `/${env}/tymlez-platform/fe-cloudfront-distribution-id`,
        ])
        : [process.env.CLOUDFRONT_DISTRIBUTION_ID];
    const defaultConfig = DEFAULT_CONFIGS[env];
    const PLATFORM_API_ORIGIN = (_a = defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.PLATFORM_API_ORIGIN) !== null && _a !== void 0 ? _a : '';
    const UON_API_ORIGIN = (_b = defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.UON_API_ORIGIN) !== null && _b !== void 0 ? _b : '';
    return Object.assign(Object.assign({}, defaultConfig), { CLOUDFRONT_DISTRIBUTION_ID, ENV: env, GIT_SHA: process.env.GIT_SHA, PLATFORM_API_ORIGIN, PLATFORM_API_URL: `${PLATFORM_API_ORIGIN}/api`, UON_API_ORIGIN, UON_API_URL: `${UON_API_ORIGIN}/client-api` });
});
exports.getBuildTimeConfig = getBuildTimeConfig;
const DEFAULT_CONFIGS = {
    local: {
        PLATFORM_API_ORIGIN: 'http://localhost:8080',
        UON_API_ORIGIN: 'http://localhost:8082',
        // PLATFORM_API_ORIGIN: 'https://dev.uon.tymlez.com',
        // UON_API_ORIGIN: 'https://dev.uon.tymlez.com',
        // OK to keep "secrets" for `local` ENV, but not for other ENV
        LOGIN_EMAIL: 'admin@uon.com',
        LOGIN_PASSWORD: 'admin1',
    },
};
//# sourceMappingURL=getBuildTimeConfig.js.map