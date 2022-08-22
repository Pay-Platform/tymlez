import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import type { IValidateDurationItem } from './IValidateDurationItem';
import type { IKnownErrorsMap } from './IKnownErrorsMap';
export declare function validateDurationBetweenTimestamps<T extends IValidateDurationItem>({ id, ascItems, expectedDuration, knownErrorsMap, hasKnownError, }: {
    id: string;
    ascItems: T[];
    expectedDuration: ITimeSpanMsec;
    knownErrorsMap?: IKnownErrorsMap;
    hasKnownError?: ({ item0, item1 }: {
        item0: T;
        item1: T;
    }) => boolean;
}): void;
