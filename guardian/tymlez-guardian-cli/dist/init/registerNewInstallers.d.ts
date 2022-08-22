interface IPolicyPackage {
    policy: {
        inputPolicyTag: string;
    };
}
export declare function registerNewInstallers({ policyPackages, GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, }: {
    policyPackages: IPolicyPackage[];
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
    GUARDIAN_TYMLEZ_API_KEY: string;
}): Promise<void>;
export {};
