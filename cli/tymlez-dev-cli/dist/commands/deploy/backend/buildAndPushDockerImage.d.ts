export declare function buildAndPushDockerImage({ imageTag, region, env, repo, }: {
    imageTag: string;
    region: string;
    env: string;
    repo: string;
}): Promise<void>;
