import { Storage } from '@google-cloud/storage';
import { withErrorHandling, withTimeout, logger } from '@tymlez/backend-libs';
import assert from 'assert';
import type { Request, Response } from 'express';
import { isNil } from 'lodash';
import { ingestCarbonEmissionHistory } from '../../modules/carbon-emissions';
import { getRequestId, IContext } from '../../modules/gcp-cloud-functions';

const handleIngestCarbonEmissionHistoryInternal = async (
  req: Request,
  res?: Response,
): Promise<void> => {
  logger.info(
    'handleIngestCarbonEmissionHistory: input',
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

  const { ENV, CLIENT_NAME } = process.env;

  assert(ENV, `ENV is missing`);
  assert(CLIENT_NAME, `CLIENT_NAME is missing`);

  const bucketName = `${ENV}-${CLIENT_NAME}-tymlez-pipeline-export`;

  // GCP Functions have access to Storage by default
  const storage = new Storage();

  await ingestCarbonEmissionHistory({
    bucketName,
    requestId: getRequestId(),
    storage,
  });

  res?.status(200).send('done');
};

const functionName = 'handleIngestCarbonEmissionHistory';

export const handleIngestCarbonEmissionHistory = withErrorHandling({
  func: withTimeout({
    func: handleIngestCarbonEmissionHistoryInternal,
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
