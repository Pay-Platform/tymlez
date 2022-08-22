import { Catch, ArgumentsHost, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { trySendMessage } from '../slack';
import { getErrorMessage } from './getErrorMessage';
import { logger } from '../pino';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private slackWebhookUrl: string | undefined,
    private logPrefix: string,
    applicationRef?: HttpServer,
  ) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    setTimeout(async () => {
      if (this.slackWebhookUrl) {
        await trySendMessage({
          url: this.slackWebhookUrl,
          text: getErrorMessage({
            err: exception,
            logPrefix: this.logPrefix,
          }),
        });
      } else {
        logger.info(
          'Skip sending error to slack, because slackWebhookUrl is missing',
        );
      }
    });
    super.catch(exception, host);
  }
}
