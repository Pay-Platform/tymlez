import { CloudFront } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import assert from 'assert';
import { promise as exec } from 'exec-sh';
import { getBuildTimeConfig } from '../getBuildTimeConfig';

export const deploy = async () => {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.ENV !== 'local', 'Cannot deploy "local"');

  const { CLOUDFRONT_DISTRIBUTION_ID } = await getBuildTimeConfig({
    env: process.env.ENV,
  });

  await exec(
    [
      'aws',
      's3',
      'sync',
      `--acl 'public-read'`,
      'out/',
      `s3://${process.env.ENV}.cohort.tymlez.com`,
    ].join(' '),
  );

  assert(CLOUDFRONT_DISTRIBUTION_ID, `CLOUDFRONT_DISTRIBUTION_ID is missing`);
  await invalidateCloudfront({ distributionId: CLOUDFRONT_DISTRIBUTION_ID });
};

async function invalidateCloudfront({
  distributionId,
}: {
  distributionId: string;
}) {
  const cloudFront = new CloudFront();
  const invalidatingItems = ['/*'];

  console.log('Invalidating CloudFront %s', distributionId, invalidatingItems);

  await cloudFront
    .createInvalidation({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: uuidv4(),
        Paths: {
          Quantity: invalidatingItems.length,
          Items: invalidatingItems,
        },
      },
    })
    .promise();
}
