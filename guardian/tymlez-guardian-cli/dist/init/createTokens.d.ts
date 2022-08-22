import type { ITokenResponse } from './ITokenResponse';
export declare function createTokens({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }: {
    GUARDIAN_TYMLEZ_API_KEY: string;
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
}): Promise<ITokenResponse[]>;
