declare const command = "check-interface [path]";
declare const desc = "Validate usage of interface";
declare const builder: {
    path: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
};
declare function handler({ path }: {
    path: string;
}): Promise<void>;
export { command, desc, handler, builder };
