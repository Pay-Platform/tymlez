export declare const logger: import("pino").Logger<{
    level: string;
    errorLikeObjectKeys: string[];
    transport: {
        target: string;
        options: {
            colorize: boolean;
        };
    } | undefined;
}>;
