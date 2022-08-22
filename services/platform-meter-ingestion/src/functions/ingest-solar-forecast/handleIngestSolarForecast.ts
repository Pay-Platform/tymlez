import { Storage } from '@google-cloud/storage';
import { readStreamAsync, runAllSettled } from '@tymlez/common-libs';
import {
  ISolcastUtilityScaleForecastResponse,
  solcastUtilityScaleForecastResponseSchema,
  withErrorHandling,
  withTimeout,
  logger,
} from '@tymlez/backend-libs';
import { isNil } from 'lodash';
import {
  getRequestId,
  IContext,
  IStorageEvent,
  toIsEventExpired,
  isValidStorageEvent,
} from '../../modules/gcp-cloud-functions';
import { ingestSolarForecasts } from '../../modules/solar-forecast';

const handleIngestSolarForecastInternal = async (
  event: IStorageEvent,
  context?: IContext,
): Promise<void> => {
  logger.info(
    'handleIngestSolarForecast: input',
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

  if (!isValidStorageEvent(event, 'solcast/', '.json')) {
    logger.warn('Skip non valid event');
    return;
  }

  // GCP Functions have access to Storage by default
  const storage = new Storage();

  await ingestSolarForecasts({
    requestId: getRequestId(context),
    forecastResponses: (
      await getForecastResponses({ event, storage })
    ).filter(
      (forecast): forecast is ISolcastUtilityScaleForecastResponse =>
        !(forecast instanceof Error),
    ),
  });
};

async function getForecastResponses({
  event,
  storage,
}: {
  event: IStorageEvent;
  storage: Storage;
}) {
  const stream = await storage
    .bucket(event.bucket)
    .file(event.name)
    .createReadStream();

  const content = await readStreamAsync(stream);

  const lines = content
    .split(/(?:\r\n|\r|\n)/g)
    .filter((line) => !!line.trim());

  return runAllSettled(lines, async (line, index) => {
    try {
      const forecastResponse = JSON.parse(line);

      await solcastUtilityScaleForecastResponseSchema.validateAsync(
        forecastResponse,
        {
          abortEarly: false,
          allowUnknown: true,
        },
      );

      return forecastResponse as ISolcastUtilityScaleForecastResponse;
    } catch (ex) {
      logger.info({ ex }, 'Failed to parse %s', index, '%d', line);
      throw ex;
    }
  });
}

const functionName = 'handleIngestSolarForecast';

export const handleIngestSolarForecast = withErrorHandling({
  func: withTimeout({
    func: handleIngestSolarForecastInternal,
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
