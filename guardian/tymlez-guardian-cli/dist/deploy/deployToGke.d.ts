export declare function deployToGke({ clientName, env, gcpProjectId, gkeCluster, region, imageTag, apiKey, datadogApiKey, }: {
    datadogApiKey: string;
    clientName: string;
    env: string;
    gcpProjectId: string;
    gkeCluster: string;
    region: string;
    imageTag: string;
    apiKey: string;
}): Promise<void>;
