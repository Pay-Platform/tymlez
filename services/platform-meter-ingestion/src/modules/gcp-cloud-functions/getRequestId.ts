import { logger } from '@tymlez/backend-libs';
import { v4 as uuidv4 } from 'uuid';
import type { IContext } from './IContext';

export function getRequestId(context?: Pick<IContext, 'eventId'>): string {
  if (context?.eventId) {
    return context.eventId;
  }

  const requestId = uuidv4();

  logger.info(`Missing requestId in the context. Auto generated: ${requestId}`);
  return requestId;
}
