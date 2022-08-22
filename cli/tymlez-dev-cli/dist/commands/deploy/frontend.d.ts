declare const handler: ({ env, clientName, source, folder }: any) => Promise<void>;
declare const command = "frontend [source]";
declare const desc = "deploy front-end application to s3 & cloudfront";
declare const builder: {
    env: {
        aliases: string[];
        type: string;
        required: boolean;
        choices: string[];
        desc: string;
    };
    clientName: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
    source: {
        aliases: string[];
        type: string;
        default: string;
        required: boolean;
        desc: string;
    };
    folder: {
        aliases: string[];
        default: string;
        type: string;
        required: boolean;
        desc: string;
    };
};
export { command, desc, builder, handler };
