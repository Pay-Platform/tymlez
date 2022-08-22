declare function handler({ bootstrapFilePath, secretsFilePath, }: {
    bootstrapFilePath: string;
    secretsFilePath: string;
}): Promise<void>;
declare const command = "put-secrets [bootstrapFilePath] [secretsFilePath]";
declare const desc = "Put secrets to AWS S3 and update the version ID in bootstrap file";
declare const builder: {
    bootstrapFilePath: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
    secretsFilePath: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
};
export { command, desc, handler, builder };
