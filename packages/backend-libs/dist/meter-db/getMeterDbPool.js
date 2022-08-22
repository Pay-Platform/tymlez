"use strict";
/* eslint-disable no-process-env */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeterDbPool = void 0;
const assert_1 = __importDefault(require("assert"));
const pg_1 = require("pg");
const common_libs_1 = require("@tymlez/common-libs");
const getMeterDbPool = ({ METER_DB_DATABASE = process.env.METER_DB_DATABASE, METER_DB_HOST = process.env.METER_DB_HOST, METER_DB_PORT = process.env.METER_DB_PORT, METER_DB_USERNAME = process.env.METER_DB_USERNAME, METER_DB_PASSWORD = process.env.METER_DB_PASSWORD, } = {}) => {
    (0, assert_1.default)(METER_DB_DATABASE, 'METER_DB_DATABASE is missing');
    (0, assert_1.default)(METER_DB_HOST, 'METER_DB_HOST is missing');
    (0, assert_1.default)(METER_DB_PORT, 'METER_DB_PORT is missing');
    (0, assert_1.default)((0, common_libs_1.isNumeric)(METER_DB_PORT), `METER_DB_PORT: "${METER_DB_PORT}" is not a number.`);
    (0, assert_1.default)(METER_DB_USERNAME, 'METER_DB_USERNAME is missing');
    (0, assert_1.default)(METER_DB_PASSWORD, 'METER_DB_PASSWORD is missing');
    const config = {
        database: METER_DB_DATABASE,
        host: METER_DB_HOST,
        port: parseInt(METER_DB_PORT, 10),
        user: METER_DB_USERNAME,
        password: METER_DB_PASSWORD,
    };
    return new pg_1.Pool(config);
};
exports.getMeterDbPool = getMeterDbPool;
//# sourceMappingURL=getMeterDbPool.js.map