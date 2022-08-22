"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProxy = exports.getProxy = exports.webProxy = void 0;
const axios_1 = __importDefault(require("axios"));
const pino_1 = require("../pino");
const inteface_1 = require("./inteface");
/**
 * Proxy http request using axios request method
 * @param url target url to proxy request
 * @param authorizationHeader Authorization header
 * @param correlationId
 * @param method http request method
 * @param query request query string
 * @param payload payload
 * @returns
 */
async function webProxy(url, headers, method = 'GET', query = {}, payload = undefined) {
    console.info({ url, method, query }, `Proxy request to -- > ${url}`);
    try {
        const { data } = await axios_1.default.request({
            url,
            method: method || 'GET',
            headers,
            data: payload,
            params: query,
        });
        return data;
    }
    catch (error) {
        pino_1.logger.error({ error, url }, 'Error when proxy request');
        throw error;
    }
}
exports.webProxy = webProxy;
/**
 * Making proxy call to external api
 * @param url API url
 * @param authorizationHeader Authorization header
 * @param correlationId
 * @param query query string to pass to external api
 * @returns the data response by external api
 */
async function getProxy(url, authorizationHeader, correlationId = '', query = {}) {
    const headers = {
        [inteface_1.HEADER_KEYS.AUTHORIZATION]: correlationId,
        [inteface_1.HEADER_KEYS.AUTHORIZATION]: authorizationHeader,
    };
    return webProxy(url, headers, 'GET', query);
}
exports.getProxy = getProxy;
async function postProxy(url, authorizationHeader, payload) {
    const headers = {
        Authorization: authorizationHeader,
    };
    return webProxy(url, headers, 'POST', {}, payload);
}
exports.postProxy = postProxy;
//# sourceMappingURL=index.js.map