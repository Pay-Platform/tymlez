import assert from 'assert';
import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import { logger } from '../pino';
import type { IValidateDurationItem } from './IValidateDurationItem';
import { hasKnownErrorInMap } from './hasKnownErrorInMap';
import type { IKnownErrorsMap } from './IKnownErrorsMap';

export function validateDurationBetweenTimestamps<
  T extends IValidateDurationItem,
>({
  id,
  ascItems,
  expectedDuration,
  knownErrorsMap,
  hasKnownError,
}: {
  id: string;
  ascItems: T[];
  expectedDuration: ITimeSpanMsec;
  knownErrorsMap?: IKnownErrorsMap;
  hasKnownError?: ({ item0, item1 }: { item0: T; item1: T }) => boolean;
}) {
  for (let i = 0; i < ascItems.length - 1; ++i) {
    const item0 = ascItems[i];
    const item1 = ascItems[i + 1];

    const timeDiffMs: ITimeSpanMsec =
      item1.timestamp.getTime() - item0.timestamp.getTime();

    if (hasKnownError) {
      if (hasKnownError({ item0, item1 })) {
        logger.info(
          `For ${id}: skip checking time difference between ${item0.timestamp.toISOString()} and ` +
            `${item1.timestamp.toISOString()} because of known error`,
        );
        continue;
      }
    }

    if (knownErrorsMap) {
      if (hasKnownErrorInMap({ id, item0, item1, knownErrorsMap })) {
        logger.info(
          `For ${id}: skip checking time difference between ${item0.timestamp.toISOString()} and ` +
            `${item1.timestamp.toISOString()} because of known error`,
        );
        continue;
      }
    }

    assert(
      timeDiffMs === expectedDuration,
      `For ${id}: time difference between ${item0.timestamp.toISOString()} and ` +
        `${item1.timestamp.toISOString()} is ${timeDiffMs}, ` +
        `does not equal to the duration of ${expectedDuration} ms`,
    );
  }
}
