export declare function waitForDeploymentReady({ versionUrl, gitSha, gitTag, }: {
    versionUrl: string;
    gitSha: string;
    gitTag: string;
}): Promise<void>;
