import { ArgumentsHost, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class AllExceptionsFilter extends BaseExceptionFilter {
    private slackWebhookUrl;
    private logPrefix;
    constructor(slackWebhookUrl: string | undefined, logPrefix: string, applicationRef?: HttpServer);
    catch(exception: unknown, host: ArgumentsHost): void;
}
