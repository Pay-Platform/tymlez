declare const command = "check-type [path] [type]";
declare const desc = "Validate usage of date type";
declare const builder: {
    path: {
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
        default: string;
    };
};
declare function handler({ path, type }: {
    path: string;
    type: string;
}): Promise<void>;
export { command, desc, handler, builder };
