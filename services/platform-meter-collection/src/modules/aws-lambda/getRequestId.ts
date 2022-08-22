import type { Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@tymlez/backend-libs';

export function getRequestId(context: Context | undefined): string {
  if (context?.awsRequestId) {
    return context.awsRequestId;
  }

  const requestId = uuidv4();

  logger.info(
    `RequestMissing requestId in the context. Auto generated: ${requestId}`,
  );
  return requestId;
}
