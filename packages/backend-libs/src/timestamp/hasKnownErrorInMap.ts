import type { IKnownErrorsMap } from './IKnownErrorsMap';
import type { IValidateDurationItem } from './IValidateDurationItem';

export function hasKnownErrorInMap({
  id,
  item0,
  item1,
  knownErrorsMap,
}: {
  id: string;
  item0: IValidateDurationItem;
  item1: IValidateDurationItem;
  knownErrorsMap: IKnownErrorsMap;
}): boolean {
  const knownErrors = knownErrorsMap[id];

  return (
    !!knownErrors &&
    knownErrors.some(
      (knownError) =>
        knownError.item0.getTime() === item0.timestamp.getTime() &&
        knownError.item1.getTime() === item1.timestamp.getTime(),
    )
  );
}
