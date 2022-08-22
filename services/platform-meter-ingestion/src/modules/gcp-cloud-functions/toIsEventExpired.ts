import { isNil } from 'lodash';
import type { IContext } from './IContext';

/**
 * Avoid infinite retry loops.
 * Refer to https://cloud.google.com/functions/docs/bestpractices/retries
 */
export function toIsEventExpired(
  context?: Pick<IContext, 'timestamp'>,
  maxAgeMs = 1_200_000, // 20 minutes
): boolean {
  if (context && !isNil(context.timestamp)) {
    const eventAgeMs = Date.now() - Date.parse(context.timestamp);

    if (eventAgeMs > maxAgeMs) {
      return true;
    }
  }

  return false;
}
