export declare const getBuildTimeConfig: ({ env, }: {
    env: string;
}) => Promise<IConfig>;
interface IConfig {
    ENV: string;
    GIT_SHA?: string;
    CLOUDFRONT_DISTRIBUTION_ID?: string;
    PLATFORM_API_ORIGIN: string;
    PLATFORM_API_URL: string;
    UON_API_ORIGIN: string;
    UON_API_URL: string;
    LOGIN_EMAIL?: string;
    LOGIN_PASSWORD?: string;
}
export {};
