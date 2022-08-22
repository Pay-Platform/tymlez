import { ITimestampMsec } from '@tymlez/common-libs';
export declare function withErrorHandling<T extends any[], U>({ func, functionName, logPrefix, getEventId, throwErrorDelay, slackWebhookUrl, }: {
    func: (...args: T) => PromiseLike<U>;
    functionName: string;
    logPrefix: string;
    getEventId: (...args: any) => string | undefined;
    throwErrorDelay?: ITimestampMsec;
    slackWebhookUrl: string | undefined;
}): (...args: T) => Promise<U>;
