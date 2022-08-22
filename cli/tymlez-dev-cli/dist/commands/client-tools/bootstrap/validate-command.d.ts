declare function handler({ filePath }: {
    filePath: string;
}): Promise<void>;
declare const command = "validate [filePath]";
declare const desc = "Validate bootstrap file";
declare const builder: {
    filePath: {
        aliases: string[];
        type: string;
        required: boolean;
        desc: string;
    };
};
export { command, desc, handler, builder };
