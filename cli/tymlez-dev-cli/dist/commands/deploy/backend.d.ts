declare const handler: ({ context, type }: any) => Promise<void>;
declare const command = "backend [context]";
declare const desc = "Build docker image and publish to ECR, Apply terraform deployment";
declare const builder: {
    context: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
    type: {
        aliases: string[];
        type: string;
        choices: string[];
        required: boolean;
        desc: string;
    };
};
export { command, desc, builder, handler };
