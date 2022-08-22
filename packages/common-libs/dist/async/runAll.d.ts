export declare function runAll<TInput, TOutput>(inputs: TInput[], callback: (input: TInput, index: number) => Promise<TOutput>, concurrency?: number): Promise<TOutput[]>;
