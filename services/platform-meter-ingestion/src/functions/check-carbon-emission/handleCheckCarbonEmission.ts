import { withErrorHandling, withTimeout, logger } from '@tymlez/backend-libs';
import type { Request, Response } from 'express';
import { isNil } from 'lodash';
import { checkCarbonEmission } from '../../modules/carbon-emissions';
import type { IContext } from '../../modules/gcp-cloud-functions';

const handleCheckCarbonEmissionInternal = async (
  req: Request,
  res?: Response,
): Promise<void> => {
  logger.info(
    'handleCheckCarbonEmission: input',
    JSON.stringify({
      req: {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
        url: req.url,
      },
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );

  await checkCarbonEmission();

  res?.status(200).send('pass');
};

const functionName = 'handleCheckCarbonEmission';

export const handleCheckCarbonEmission = withErrorHandling({
  func: withTimeout({
    func: handleCheckCarbonEmissionInternal,
    functionName,
    rawTimeout: 300_000,
  }),
  functionName,
  getEventId: (_event, context?: IContext) => context?.eventId,
  logPrefix: `${process.env.CLIENT_NAME}-${process.env.ENV}`,
  slackWebhookUrl: process.env.DEV_OPS_SLACK_WEBHOOK_URL,
  throwErrorDelay: !isNil(process.env.THROW_ERROR_DELAY)
    ? parseInt(process.env.THROW_ERROR_DELAY, 10)
    : 30_000,
});
