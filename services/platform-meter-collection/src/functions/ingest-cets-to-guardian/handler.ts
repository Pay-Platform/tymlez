import 'source-map-support/register';
import assert from 'assert';
import { getParameters } from '@tymlez/common-libs';
import {
  IAboutToTimeout,
  withAwsLambdaTimeout,
  withErrorHandling,
  logger,
} from '@tymlez/backend-libs';
import type { Context } from 'aws-lambda';
import type { IBootstrapWithSecrets } from '@tymlez/backend-libs';
import { loadAndIngestCetsToGuardian } from '../../modules/track-and-trace';
import { getRequestId } from '../../modules/aws-lambda';

const handleIngestCetsToGuardian = async (
  event: any,
  context?: Context & { aboutToTimeout?: IAboutToTimeout },
) => {
  logger.info(
    'handleIngestToGuardian: input',
    JSON.stringify({
      event,
      context,
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );
  const { ENV } = process.env;
  assert(ENV, `ENV is missing`);

  const [BOOTSTRAP_DATA] = await getParameters([
    `/${ENV}/tymlez-platform/client-bootstrap-data`,
  ]);

  assert(BOOTSTRAP_DATA, `BOOTSTRAP_DATA is missing`);
  const bootstrap: IBootstrapWithSecrets = JSON.parse(BOOTSTRAP_DATA);

  await loadAndIngestCetsToGuardian({
    requestId: getRequestId(context),
    bootstrap,
    aboutToTimeout: context?.aboutToTimeout,
  });
};

export const handle = withErrorHandling({
  func: withAwsLambdaTimeout({
    func: handleIngestCetsToGuardian,
    functionName: handleIngestCetsToGuardian.name,
  }),
  getEventId: (_event: any, context?: Context) => context?.awsRequestId,
  functionName: handleIngestCetsToGuardian.name,
  logPrefix: `${process.env.CLIENT_NAME}-${process.env.ENV}`,
  slackWebhookUrl: process.env.DEV_OPS_SLACK_WEBHOOK_URL,
});
