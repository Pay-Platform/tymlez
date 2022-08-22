import 'source-map-support/register';
import _ from 'lodash';
import assert from 'assert';
import { getParameters } from '@tymlez/common-libs';
import {
  withAwsLambdaTimeout,
  withErrorHandling,
  logger,
} from '@tymlez/backend-libs';
import type { Context } from 'aws-lambda';
import type { IBootstrapWithSecrets } from '@tymlez/backend-libs';
import { PubSub } from '@google-cloud/pubsub';
import { collectAndIngestMeterLive } from '../../modules/meter-live';
import { getRequestId } from '../../modules/aws-lambda';

const handleCollectAndIngestMeterLive = async (
  event: any,
  context?: Context,
) => {
  logger.info(
    'handleCollectAndIngestMeterLive: input',
    JSON.stringify({
      event,
      context,
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );
  assert(process.env.ENV, `ENV is missing`);

  const [GCP_METER_COLLECTION_CREDENTIALS, BOOTSTRAP_DATA] =
    await getParameters([
      `/${process.env.ENV}/tymlez-platform/gcp-meter-collection-credentials.json`,
      `/${process.env.ENV}/tymlez-platform/client-bootstrap-data`,
    ]);

  assert(BOOTSTRAP_DATA, `BOOTSTRAP_DATA is missing`);
  const bootstrap: IBootstrapWithSecrets = JSON.parse(BOOTSTRAP_DATA);

  assert(
    GCP_METER_COLLECTION_CREDENTIALS,
    `GCP_METER_COLLECTION_CREDENTIALS is missing`,
  );

  const gcpCredentials = JSON.parse(GCP_METER_COLLECTION_CREDENTIALS);
  const pubsub = new PubSub({
    projectId: gcpCredentials.project_id,
    credentials: gcpCredentials,
  });

  await collectAndIngestMeterLive({
    requestId: getRequestId(context),
    meters: Object.values(bootstrap.site_details)
      .map((siteDetail) =>
        Object.values(siteDetail.meter_details).map((meterDetail) => ({
          meterId: meterDetail.meter_id,
          apiKey: meterDetail.api_key,
        })),
      )
      .flat(),
    pubsub,
  });
};

export const handle = withErrorHandling({
  func: withAwsLambdaTimeout({
    func: handleCollectAndIngestMeterLive,
    functionName: handleCollectAndIngestMeterLive.name,
  }),
  getEventId: (_event: any, context?: Context) => context?.awsRequestId,
  functionName: handleCollectAndIngestMeterLive.name,
  logPrefix: `${process.env.CLIENT_NAME}-${process.env.ENV}`,
  slackWebhookUrl: process.env.DEV_OPS_SLACK_WEBHOOK_URL,
});
