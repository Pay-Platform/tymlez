"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianClientApi = void 0;
const axios_1 = __importDefault(require("axios"));
const promise_retry_1 = __importDefault(require("promise-retry"));
const api_1 = require("./api");
const configuration_1 = require("./configuration");
class GuardianClientApi {
    constructor(apiBaseUrl, defaultRetry = 3) {
        this.apiBaseUrl = apiBaseUrl;
        this.defaultRetry = defaultRetry;
        this.http = axios_1.default.create();
        this.config = new configuration_1.Configuration({});
        this.accountApi = new api_1.AccountsApi(this.config, this.apiBaseUrl, this.http);
        this.demoApi = new api_1.DemoApi(this.config, this.apiBaseUrl, this.http);
        this.profileApi = new api_1.ProfilesApi(this.config, this.apiBaseUrl, this.http);
        this.ipfsApi = new api_1.IpfsApi(this.config, this.apiBaseUrl, this.http);
        this.tokensApi = new api_1.TokensApi(this.config, this.apiBaseUrl, this.http);
        this.policiesApi = new api_1.PoliciesApi(this.config, this.apiBaseUrl, this.http);
        this.schemasApi = new api_1.SchemasApi(this.config, this.apiBaseUrl, this.http);
        this.externalApis = new api_1.ExternalApi(this.config, this.apiBaseUrl, this.http);
        this.trustchainsApi = new api_1.TrustchainsApi(this.config, this.apiBaseUrl, this.http);
    }
    getRequestOptions(session) {
        return {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        };
    }
    auth() {
        return {
            login: (username, password) => this.wrapperAxiosCall(() => this.accountApi.accountsLoginPost({ username, password }), this.defaultRetry)(),
        };
    }
    external() {
        return {
            send: (session, data) => this.wrapperAxiosCall(() => this.externalApis.externalPost(data, this.getRequestOptions(session)), this.defaultRetry)(),
        };
    }
    schema() {
        return {
            getAll: (session, pageIndex, pageSize) => this.wrapperAxiosCall(() => this.schemasApi.schemasGet(pageIndex, pageSize, this.getRequestOptions(session)), this.defaultRetry)(),
            create: (session, schema) => this.wrapperAxiosCall(() => this.schemasApi.schemasPost(schema, this.getRequestOptions(session)), this.defaultRetry)(),
            publish: (session, schemaId, version) => this.wrapperAxiosCall(() => this.schemasApi.schemasSchemaIdPublishPut(schemaId, {
                version,
            }, this.getRequestOptions(session)), this.defaultRetry)(),
        };
    }
    policy() {
        return {
            getAll: (session, pageIndex, pageSize) => this.wrapperAxiosCall(() => this.policiesApi.policiesGet(pageIndex, pageSize, this.getRequestOptions(session)), this.defaultRetry)(),
            create: (session, policy) => this.wrapperAxiosCall(() => this.policiesApi.policiesPost(policy, this.getRequestOptions(session)), this.defaultRetry)(),
            publish: (session, policyId, policyVersion) => this.wrapperAxiosCall(() => this.policiesApi.policiesPolicyIdPublishPut(policyId, { policyVersion }, this.getRequestOptions(session)), this.defaultRetry)(),
            getBlockTagId: (session, policyId, blockTag) => this.wrapperAxiosCall(() => this.policiesApi.policiesPolicyIdTagTagGet(policyId, blockTag, this.getRequestOptions(session)), this.defaultRetry)(),
            getRootBlocks: (session, policyId) => this.wrapperAxiosCall(() => this.policiesApi.policiesPolicyIdBlocksGet(policyId, this.getRequestOptions(session)), this.defaultRetry)(),
            setBlockData: (session, policyId, uuid, data) => this.wrapperAxiosCall(() => this.policiesApi.policiesPolicyIdBlocksUuidPost(policyId, uuid, data, this.getRequestOptions(session)), this.defaultRetry)(),
            getBlockData: (session, policyId, uuid) => this.wrapperAxiosCall(() => this.policiesApi.policiesPolicyIdBlocksUuidGet(policyId, uuid, this.getRequestOptions(session)), this.defaultRetry)(),
        };
    }
    token() {
        return {
            getUserToken: (session, tokenId, username) => this.wrapperAxiosCall(() => this.tokensApi.tokensTokenIdUsernameInfoGet(tokenId, username, this.getRequestOptions(session)), this.defaultRetry)(),
            listTokens: (session) => this.wrapperAxiosCall(() => this.tokensApi.tokensGet(this.getRequestOptions(session)), this.defaultRetry)(),
            create: (session, token) => this.wrapperAxiosCall(() => this.tokensApi.tokensPost(token, this.getRequestOptions(session)), this.defaultRetry)(),
            associate: (session, tokenId) => this.wrapperAxiosCall(() => this.tokensApi.tokensTokenIdAssociatePut(tokenId, this.getRequestOptions(session)), this.defaultRetry)(),
            grantKyc: (session, tokenId, username) => this.wrapperAxiosCall(() => this.tokensApi.tokensTokenIdUsernameGrantKycPut(tokenId, username || session.username, this.getRequestOptions(session)), this.defaultRetry)(),
        };
    }
    ipfs() {
        const { http } = this;
        const baseURL = this.apiBaseUrl;
        async function ipfsFilePost(session, data) {
            const { data: ipfsId } = await http.request({
                method: 'post',
                url: `ipfs/file`,
                baseURL,
                headers: {
                    'Content-Type': 'binary/octet-stream',
                    Accept: 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                data: Buffer.from(JSON.stringify(data)),
            });
            return `https://ipfs.io/ipfs/${ipfsId}`;
        }
        return {
            /**
             * Upload data to ipdf
             */
            upload: (session, doc) => this.wrapperAnyCall(() => ipfsFilePost(session, doc), this.defaultRetry)(),
        };
    }
    profile() {
        return {
            /**
             * Get profile of current user or by username
             * @param session current login session of user
             * @param username username if login as authority
             * @returns
             */
            getProfile: (session, username) => this.wrapperAxiosCall(() => this.profileApi.profilesUsernameGet(username || session.username, this.getRequestOptions(session)), this.defaultRetry)(),
            /**
             * Update profile of current user
             * @param session
             * @param username
             * @param user
             * @returns
             */
            updateProfile: (session, username, user) => this.wrapperAxiosCall(() => this.profileApi.profilesUsernamePut(username || session.username, user, this.getRequestOptions(session)), this.defaultRetry)(),
        };
    }
    /**
     * return wrapper set of demo api
     * @returns
     */
    demo() {
        return {
            getRandomKey: this.wrapperAxiosCall(() => this.demoApi.demoRandomKeyGet(), this.defaultRetry),
            /**
             * Get all of registered users
             */
            getRegisteredUsers: this.wrapperAxiosCall(() => this.demoApi.demoRegisteredUsersGet(), this.defaultRetry),
        };
    }
    trustchains(session) {
        return {
            query: this.wrapperAxiosCall(() => this.trustchainsApi.trustchainsGet(this.getRequestOptions(session)), this.defaultRetry),
        };
    }
    wrapperAnyCall(fn, retries = 3) {
        const internal = async () => {
            return await fn();
        };
        return async () => {
            return (0, promise_retry_1.default)((retry) => {
                return internal().catch(retry);
            }, { retries });
        };
    }
    wrapperAxiosCall(fn, retries = 3) {
        const internal = async () => {
            const { data } = await fn();
            return data;
        };
        return async () => {
            return (0, promise_retry_1.default)((retry) => {
                return internal().catch((err) => {
                    console.log(err?.response?.data);
                    return retry(err);
                });
            }, { retries });
        };
    }
}
exports.GuardianClientApi = GuardianClientApi;
//# sourceMappingURL=guardian-api-client.js.map