import axios, { AxiosInstance } from 'axios';
import type { AxiosResponse } from 'axios';
import promiseRetry from 'promise-retry';
import {
  AccountsApi,
  DemoApi,
  Session,
  ProfilesApi,
  IpfsApi,
  User,
  TokensApi,
  PoliciesApi,
  SchemasApi,
  Token,
  TrustchainsApi,
  Schema,
  PolicyConfig,
  ExternalApi,
  ExternalData,
} from './api';
import { Configuration } from './configuration';

export class GuardianClientApi {
  public accountApi: AccountsApi;
  public profileApi: ProfilesApi;
  public demoApi: DemoApi;
  private config: Configuration;
  private http: AxiosInstance;
  private tokensApi: TokensApi;
  private ipfsApi: IpfsApi;
  private trustchainsApi: TrustchainsApi;
  private policiesApi: PoliciesApi;
  private schemasApi: SchemasApi;
  private externalApis: ExternalApi;

  constructor(private apiBaseUrl: string, private defaultRetry = 3) {
    this.http = axios.create();
    this.config = new Configuration({});
    this.accountApi = new AccountsApi(this.config, this.apiBaseUrl, this.http);
    this.demoApi = new DemoApi(this.config, this.apiBaseUrl, this.http);
    this.profileApi = new ProfilesApi(this.config, this.apiBaseUrl, this.http);
    this.ipfsApi = new IpfsApi(this.config, this.apiBaseUrl, this.http);
    this.tokensApi = new TokensApi(this.config, this.apiBaseUrl, this.http);
    this.policiesApi = new PoliciesApi(this.config, this.apiBaseUrl, this.http);
    this.schemasApi = new SchemasApi(this.config, this.apiBaseUrl, this.http);
    this.externalApis = new ExternalApi(
      this.config,
      this.apiBaseUrl,
      this.http,
    );
    this.trustchainsApi = new TrustchainsApi(
      this.config,
      this.apiBaseUrl,
      this.http,
    );
  }

  private getRequestOptions(session: Session) {
    return {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
  }

  public auth() {
    return {
      login: (username: string, password: string) =>
        this.wrapperAxiosCall(
          () => this.accountApi.accountsLoginPost({ username, password }),
          this.defaultRetry,
        )(),
    };
  }

  public external() {
    return {
      send: (session: Session, data: ExternalData) =>
        this.wrapperAxiosCall(
          () =>
            this.externalApis.externalPost(
              data,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
    };
  }

  public schema() {
    return {
      getAll: (session: Session, pageIndex?: number, pageSize?: number) =>
        this.wrapperAxiosCall(
          () =>
            this.schemasApi.schemasGet(
              pageIndex,
              pageSize,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      create: (session: Session, schema: Schema) =>
        this.wrapperAxiosCall(
          () =>
            this.schemasApi.schemasPost(
              schema,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      publish: (session: Session, schemaId: string, version: string) =>
        this.wrapperAxiosCall(
          () =>
            this.schemasApi.schemasSchemaIdPublishPut(
              schemaId,
              {
                version,
              },
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
    };
  }

  public policy() {
    return {
      getAll: (session: Session, pageIndex?: number, pageSize?: number) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesGet(
              pageIndex,
              pageSize,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      create: (session: Session, policy: PolicyConfig) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPost(
              policy,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      publish: (session: Session, policyId: string, policyVersion: string) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPolicyIdPublishPut(
              policyId,
              { policyVersion },
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      getBlockTagId: (session: Session, policyId: string, blockTag: string) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPolicyIdTagTagGet(
              policyId,
              blockTag,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
      getRootBlocks: (session: Session, policyId: string) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPolicyIdBlocksGet(
              policyId,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      setBlockData: (
        session: Session,
        policyId: string,
        uuid: string,
        data: any,
      ) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPolicyIdBlocksUuidPost(
              policyId,
              uuid,
              data,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      getBlockData: (session: Session, policyId: string, uuid: string) =>
        this.wrapperAxiosCall(
          () =>
            this.policiesApi.policiesPolicyIdBlocksUuidGet(
              policyId,
              uuid,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
    };
  }

  public token() {
    return {
      getUserToken: (session: Session, tokenId: string, username: string) =>
        this.wrapperAxiosCall(
          () =>
            this.tokensApi.tokensTokenIdUsernameInfoGet(
              tokenId,
              username,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),

      listTokens: (session: Session) =>
        this.wrapperAxiosCall(
          () => this.tokensApi.tokensGet(this.getRequestOptions(session)),
          this.defaultRetry,
        )(),

      create: (session: Session, token: Token) =>
        this.wrapperAxiosCall(
          () =>
            this.tokensApi.tokensPost(token, this.getRequestOptions(session)),
          this.defaultRetry,
        )(),
      associate: (session: Session, tokenId: string) =>
        this.wrapperAxiosCall(
          () =>
            this.tokensApi.tokensTokenIdAssociatePut(
              tokenId,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
      grantKyc: (session: Session, tokenId: string, username: string) =>
        this.wrapperAxiosCall(
          () =>
            this.tokensApi.tokensTokenIdUsernameGrantKycPut(
              tokenId,
              username || session.username,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
    };
  }

  public ipfs() {
    const { http } = this;
    const baseURL = this.apiBaseUrl;
    async function ipfsFilePost<T>(session: Session, data: T): Promise<string> {
      const { data: ipfsId } = await http.request<string>({
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
      upload: (session: Session, doc: any) =>
        this.wrapperAnyCall(
          () => ipfsFilePost(session, doc),

          this.defaultRetry,
        )(),
    };
  }

  public profile() {
    return {
      /**
       * Get profile of current user or by username
       * @param session current login session of user
       * @param username username if login as authority
       * @returns
       */
      getProfile: (session: Session, username?: string) =>
        this.wrapperAxiosCall(
          () =>
            this.profileApi.profilesUsernameGet(
              username || session.username,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
      /**
       * Update profile of current user
       * @param session
       * @param username
       * @param user
       * @returns
       */
      updateProfile: (
        session: Session,
        username: string,
        user: Partial<User>,
      ) =>
        this.wrapperAxiosCall(
          () =>
            this.profileApi.profilesUsernamePut(
              username || session.username,
              user as User,
              this.getRequestOptions(session),
            ),
          this.defaultRetry,
        )(),
    };
  }

  /**
   * return wrapper set of demo api
   * @returns
   */
  public demo() {
    return {
      getRandomKey: this.wrapperAxiosCall(
        () => this.demoApi.demoRandomKeyGet(),
        this.defaultRetry,
      ),
      /**
       * Get all of registered users
       */
      getRegisteredUsers: this.wrapperAxiosCall(
        () => this.demoApi.demoRegisteredUsersGet(),
        this.defaultRetry,
      ),
    };
  }

  public trustchains(session: Session) {
    return {
      query: this.wrapperAxiosCall(
        () =>
          this.trustchainsApi.trustchainsGet(this.getRequestOptions(session)),
        this.defaultRetry,
      ),
    };
  }

  private wrapperAnyCall<T>(fn: () => Promise<T>, retries = 3) {
    const internal = async () => {
      return await fn();
    };
    return async () => {
      return promiseRetry(
        (retry: any) => {
          return internal().catch(retry);
        },
        { retries },
      );
    };
  }

  private wrapperAxiosCall<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retries = 3,
  ) {
    const internal = async () => {
      const { data } = await fn();
      return data;
    };
    return async () => {
      return promiseRetry(
        (retry: any) => {
          return internal().catch((err) => {
            console.log(err?.response?.data);
            return retry(err) as Promise<T>;
          });
        },
        { retries },
      );
    };
  }
}
