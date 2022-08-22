export declare function deployViaTerraform({ gitSha, gitTag, tfToken, workspaceName, }: {
    gitSha: string;
    gitTag: string;
    tfToken: string;
    workspaceName: string;
}): Promise<void>;
