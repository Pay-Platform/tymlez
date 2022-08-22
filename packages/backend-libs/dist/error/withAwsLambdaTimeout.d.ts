import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
export declare function withAwsLambdaTimeout<T extends (Object | undefined)[], U>({ func, functionName, timeoutBuffer, aboutToTimeoutBuffer, }: {
    func: (...args: T) => PromiseLike<U>;
    functionName: string;
    /**
     * Timeout buffer to allow JavaScript error handling to run before
     * the serverless function runtime timeout
     */
    timeoutBuffer?: ITimeSpanMsec;
    aboutToTimeoutBuffer?: ITimeSpanMsec;
}): (...args: T) => Promise<U>;
