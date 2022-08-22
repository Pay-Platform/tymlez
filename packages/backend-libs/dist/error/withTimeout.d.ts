import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
export declare function withTimeout<T extends any[], U>({ func, functionName, rawTimeout, timeBuffer, }: {
    func: (...args: T) => PromiseLike<U>;
    functionName: string;
    /**
     * Serverless function runtime timeout without buffer
     */
    rawTimeout: ITimeSpanMsec;
    /**
     * Time buffer to allow JavaScript error handling to run before
     * the serverless function runtime timeout
     */
    timeBuffer?: ITimeSpanMsec;
}): (...args: T) => Promise<U>;
