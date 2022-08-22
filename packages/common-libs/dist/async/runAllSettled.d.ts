export declare function runAllSettled<TInput, TOutput>(inputs: (TInput | Error)[], callback: (input: TInput, index: number) => Promise<TOutput>, concurrency?: number): Promise<(TOutput | Error)[]>;
