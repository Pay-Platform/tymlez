import type { ITokenResponse } from './ITokenResponse';
export declare function grantTokenKycToInstallers({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, installers, tokens, }: {
    tokens: ITokenResponse[];
    installers: string[];
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
    GUARDIAN_TYMLEZ_API_KEY: string;
}): Promise<void>;
