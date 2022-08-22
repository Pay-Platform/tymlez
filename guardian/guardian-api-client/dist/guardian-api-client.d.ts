import { AccountsApi, DemoApi, Session, ProfilesApi, User, Token, Schema, PolicyConfig, ExternalData } from './api';
export declare class GuardianClientApi {
    private apiBaseUrl;
    private defaultRetry;
    accountApi: AccountsApi;
    profileApi: ProfilesApi;
    demoApi: DemoApi;
    private config;
    private http;
    private tokensApi;
    private ipfsApi;
    private trustchainsApi;
    private policiesApi;
    private schemasApi;
    private externalApis;
    constructor(apiBaseUrl: string, defaultRetry?: number);
    private getRequestOptions;
    auth(): {
        login: (username: string, password: string) => Promise<Session>;
    };
    external(): {
        send: (session: Session, data: ExternalData) => Promise<void>;
    };
    schema(): {
        getAll: (session: Session, pageIndex?: number | undefined, pageSize?: number | undefined) => Promise<Schema[]>;
        create: (session: Session, schema: Schema) => Promise<void>;
        publish: (session: Session, schemaId: string, version: string) => Promise<Schema[]>;
    };
    policy(): {
        getAll: (session: Session, pageIndex?: number | undefined, pageSize?: number | undefined) => Promise<(PolicyConfig & object)[]>;
        create: (session: Session, policy: PolicyConfig) => Promise<void>;
        publish: (session: Session, policyId: string, policyVersion: string) => Promise<import("./api").PublishPolicy>;
        getBlockTagId: (session: Session, policyId: string, blockTag: string) => Promise<import("./api").InlineResponse200>;
        getRootBlocks: (session: Session, policyId: string) => Promise<import("./api").PolicyBlock>;
        setBlockData: (session: Session, policyId: string, uuid: string, data: any) => Promise<void>;
        getBlockData: (session: Session, policyId: string, uuid: string) => Promise<import("./api").PolicyBlockData>;
    };
    token(): {
        getUserToken: (session: Session, tokenId: string, username: string) => Promise<import("./api").TokenInfo>;
        listTokens: (session: Session) => Promise<(import("./api").TokenInfo & object)[]>;
        create: (session: Session, token: Token) => Promise<(import("./api").TokenInfo & object)[]>;
        associate: (session: Session, tokenId: string) => Promise<void>;
        grantKyc: (session: Session, tokenId: string, username: string) => Promise<import("./api").TokenInfo>;
    };
    ipfs(): {
        /**
         * Upload data to ipdf
         */
        upload: (session: Session, doc: any) => Promise<string>;
    };
    profile(): {
        /**
         * Get profile of current user or by username
         * @param session current login session of user
         * @param username username if login as authority
         * @returns
         */
        getProfile: (session: Session, username?: string | undefined) => Promise<User>;
        /**
         * Update profile of current user
         * @param session
         * @param username
         * @param user
         * @returns
         */
        updateProfile: (session: Session, username: string, user: Partial<User>) => Promise<void>;
    };
    /**
     * return wrapper set of demo api
     * @returns
     */
    demo(): {
        getRandomKey: () => Promise<import("./api").HederaAccount>;
        /**
         * Get all of registered users
         */
        getRegisteredUsers: () => Promise<(import("./api").Account & object)[]>;
    };
    trustchains(session: Session): {
        query: () => Promise<import("./api").VerifiablePresentation[]>;
    };
    private wrapperAnyCall;
    private wrapperAxiosCall;
}
