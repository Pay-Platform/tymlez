import { Storage } from '@google-cloud/storage';
import { withErrorHandling, withTimeout, logger } from '@tymlez/backend-libs';
import { isNil } from 'lodash';
import { ingestCarbonEmissionLive } from '../../modules/carbon-emissions';

import {
  getRequestId,
  IContext,
  IStorageEvent,
  toIsEventExpired,
  isValidStorageEvent,
} from '../../modules/gcp-cloud-functions';

const handleIngestCarbonEmissionLiveInternal = async (
  event: IStorageEvent,
  context?: IContext,
): Promise<void> => {
  logger.info(
    'handleIngestCarbonEmissionLive: input',
    JSON.stringify({
      event,
      context,
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );

  if (toIsEventExpired(context)) {
    logger.warn(`Skip expired event ${context?.eventId}`);
    return;
  }

  if (!isValidStorageEvent(event, 'aemo_dispatches/', '.json')) {
    logger.warn('Skip non valid event');
    return;
  }

  // GCP Functions have access to Storage by default
  const storage = new Storage();

  await ingestCarbonEmissionLive({
    storageFileInfo: event,
    requestId: getRequestId(context),
    storage,
  });
};

const functionName = 'handleIngestCarbonEmissionLive';

export const handleIngestCarbonEmissionLive = withErrorHandling({
  func: withTimeout({
    func: handleIngestCarbonEmissionLiveInternal,
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
