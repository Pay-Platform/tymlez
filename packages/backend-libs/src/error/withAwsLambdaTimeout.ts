import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import pTimeout, { TimeoutError } from 'p-timeout';
import type { IAboutToTimeout } from './IAboutToTimeout';
import { logger } from '../pino';

export function withAwsLambdaTimeout<T extends (Object | undefined)[], U>({
  func,
  functionName,
  timeoutBuffer = 6_000,
  aboutToTimeoutBuffer = 12_000,
}: {
  func: (...args: T) => PromiseLike<U>;
  functionName: string;
  /**
   * Timeout buffer to allow JavaScript error handling to run before
   * the serverless function runtime timeout
   */
  timeoutBuffer?: ITimeSpanMsec;
  aboutToTimeoutBuffer?: ITimeSpanMsec;
}): (...args: T) => Promise<U> {
  return async (...args) => {
    const context = args[1] as
      | {
          getRemainingTimeInMillis: () => ITimeSpanMsec;
          aboutToTimeout?: IAboutToTimeout;
        }
      | undefined;

    if (context?.getRemainingTimeInMillis) {
      const rawTimeout = context.getRemainingTimeInMillis();
      const timeout = rawTimeout - timeoutBuffer;

      if (timeout > 0) {
        const totalAboutToTimeoutBuffer = aboutToTimeoutBuffer + timeoutBuffer;
        context.aboutToTimeout = () => {
          const remainingTime: ITimeSpanMsec =
            context.getRemainingTimeInMillis();

          if (remainingTime < totalAboutToTimeoutBuffer) {
            return true;
          }

          return false;
        };

        logger.info(
          {
            timeoutBuffer,
            totalAboutToTimeoutBuffer,
          },
          `${functionName}: Function will timeout in ${timeout}.`,
        );
        try {
          return await pTimeout(func(...args), timeout);
        } catch (ex) {
          if (ex instanceof TimeoutError) {
            logger.error({ ex }, `${functionName}: Function has timed out %s`, {
              remainingTime: context.getRemainingTimeInMillis(),
            });
          }
          throw ex;
        }
      }

      logger.warn(
        `${functionName}: No timeout set, timeout is ${timeout}, which is less than 0.`,
      );
    } else {
      logger.warn(
        `${functionName}: No timeout set, because context.getRemainingTimeInMillis() not available.`,
      );
    }

    return await func(...args);
  };
}
