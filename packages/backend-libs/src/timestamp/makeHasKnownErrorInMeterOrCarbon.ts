import { KNOWN_CARBON_EMISSION_ERRORS_MAP } from '.';
import { KNOWN_WATTWATCHERS_ERRORS_MAP } from './constants';
import { hasKnownErrorInMap } from './hasKnownErrorInMap';
import type { IKnownErrorsMap } from './IKnownErrorsMap';

export const makeHasKnownErrorInMeterOrCarbon =
  ({
    knownMeterErrorsMap = KNOWN_WATTWATCHERS_ERRORS_MAP,
    knownCarbonErrorsMap = KNOWN_CARBON_EMISSION_ERRORS_MAP,
  }: {
    knownMeterErrorsMap?: IKnownErrorsMap;
    knownCarbonErrorsMap?: IKnownErrorsMap;
  } = {}) =>
  ({
    item0,
    item1,
  }: {
    item0: { timestamp: Date; meterId: string; region: string };
    item1: { timestamp: Date; meterId: string; region: string };
  }): boolean => {
    if (
      hasKnownErrorInMap({
        id: item0.meterId,
        item0,
        item1,
        knownErrorsMap: knownMeterErrorsMap,
      })
    ) {
      return true;
    }

    if (
      hasKnownErrorInMap({
        id: item0.region,
        item0,
        item1,
        knownErrorsMap: knownCarbonErrorsMap,
      })
    ) {
      return true;
    }

    return false;
  };
