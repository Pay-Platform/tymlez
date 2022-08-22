import 'source-map-support/register';
import _ from 'lodash';
import assert from 'assert';
import { getParameters } from '@tymlez/common-libs';
import {
  withAwsLambdaTimeout,
  withErrorHandling,
  logger,
} from '@tymlez/backend-libs';
import type { IBootstrap } from '@tymlez/backend-libs';
import type { Context } from 'aws-lambda';
import { checkSolarForecast } from '../../modules/solar-forecast';

const handleCheckSolarForecast = async (event: any, context?: Context) => {
  logger.info(
    'handleCheckSolarForecast: input',
    JSON.stringify({
      event,
      context,
      GIT_SHA: process.env.GIT_SHA,
      GIT_TAG: process.env.GIT_TAG,
    }),
  );
  assert(process.env.ENV, `ENV is missing`);

  const [BOOTSTRAP_DATA] = await getParameters([
    `/${process.env.ENV}/tymlez-platform/client-bootstrap-data`,
  ]);

  assert(BOOTSTRAP_DATA, `BOOTSTRAP_DATA is missing`);
  const bootstrap: IBootstrap = JSON.parse(BOOTSTRAP_DATA);

  await checkSolarForecast(bootstrap);
};

export const handle = withErrorHandling({
  func: withAwsLambdaTimeout({
    func: handleCheckSolarForecast,
    functionName: handleCheckSolarForecast.name,
  }),
  getEventId: (_event: any, context?: Context) => context?.awsRequestId,
  functionName: handleCheckSolarForecast.name,
  logPrefix: `${process.env.CLIENT_NAME}-${process.env.ENV}`,
  slackWebhookUrl: process.env.DEV_OPS_SLACK_WEBHOOK_URL,
});
