import type { IKnownErrorsMap } from './IKnownErrorsMap';
import type { IValidateDurationItem } from './IValidateDurationItem';
export declare function hasKnownErrorInMap({ id, item0, item1, knownErrorsMap, }: {
    id: string;
    item0: IValidateDurationItem;
    item1: IValidateDurationItem;
    knownErrorsMap: IKnownErrorsMap;
}): boolean;
