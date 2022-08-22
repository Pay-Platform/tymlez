import { ITimestampMsec, waitFor } from '@tymlez/common-libs';
import { trySendMessage } from '../slack';
import { getErrorMessage } from './getErrorMessage';
import { logger } from '../pino';

export function withErrorHandling<T extends any[], U>({
  func,
  functionName,
  logPrefix,
  getEventId,
  throwErrorDelay,
  slackWebhookUrl,
}: {
  func: (...args: T) => PromiseLike<U>;
  functionName: string;
  logPrefix: string;
  getEventId: (...args: any) => string | undefined;
  throwErrorDelay?: ITimestampMsec;
  slackWebhookUrl: string | undefined;
}): (...args: T) => Promise<U> {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (err) {
      const eventId = getEventId(...args);

      const errorMessage = getErrorMessage({
        eventId,
        logPrefix,
        functionName,
        err,
      });

      logger.error({ err }, errorMessage);

      if (slackWebhookUrl) {
        await trySendMessage({
          url: slackWebhookUrl,
          text: errorMessage,
        });
      } else {
        logger.info(
          'Skip sending error to slack, because slackWebhookUrl is missing',
        );
      }

      if (throwErrorDelay) {
        await waitFor(throwErrorDelay);
      }

      throw err;
    }
  };
}
