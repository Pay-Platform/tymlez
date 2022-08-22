export declare function pushDockerImageToEcr({ ecrRegistry, ecrRepository, imageTag, }: {
    ecrRegistry: string;
    ecrRepository: string;
    imageTag: string;
}): Promise<void>;
