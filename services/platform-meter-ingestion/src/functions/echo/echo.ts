import { logger } from '@tymlez/backend-libs';
import { safeJsonStringify } from '@tymlez/common-libs';

export const echo = async (event: any, context: any) => {
  logger.info(
    'echo: input',
    safeJsonStringify({
      event,
      context,
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );

  if (context && context.status && context.send) {
    const res = context;
    logger.info('Sending HTTP response');
    res.status(200).send('done');
  }
};
