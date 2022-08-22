import { Options } from 'p-retry';
export declare function asyncRetry<T>(input: (attemptCount: number) => PromiseLike<T> | T, options?: Options): Promise<T>;
