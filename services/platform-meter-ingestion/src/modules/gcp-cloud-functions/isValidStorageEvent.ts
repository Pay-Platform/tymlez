import { logger } from '@tymlez/backend-libs';
import type { IStorageEvent } from './IStorageEvent';

export function isValidStorageEvent(
  event: IStorageEvent,
  prefix = '',
  postfix = '',
): boolean {
  if (event.size === '0') {
    logger.warn(`Skip file ${event.name} with size 0`);
    return false;
  }

  if (prefix && !event.name.startsWith(prefix)) {
    logger.warn(`Skip file ${event.name} that is not in the ${prefix} folder`);
    return false;
  }

  if (postfix && !event.name.endsWith(postfix)) {
    logger.warn(`Skip file ${event.name} is not end with ${postfix}`);
    return false;
  }

  return true;
}
