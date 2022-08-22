import type { ITokenResponse } from './ITokenResponse';
export declare function createPolicyPackages({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, tokens, }: {
    GUARDIAN_TYMLEZ_API_KEY: string;
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
    tokens: ITokenResponse[];
}): Promise<any[]>;
