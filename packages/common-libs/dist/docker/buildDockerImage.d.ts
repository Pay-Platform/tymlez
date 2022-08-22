export declare function buildDockerImage({ ecrRegistry, ecrRepository, imageTag, context, dockerFile, }: {
    ecrRegistry: string;
    ecrRepository: string;
    imageTag: string;
    context?: string;
    dockerFile?: string;
}): Promise<void>;
