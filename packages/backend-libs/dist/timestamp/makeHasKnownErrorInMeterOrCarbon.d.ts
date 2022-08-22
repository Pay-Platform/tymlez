import type { IKnownErrorsMap } from './IKnownErrorsMap';
export declare const makeHasKnownErrorInMeterOrCarbon: ({ knownMeterErrorsMap, knownCarbonErrorsMap, }?: {
    knownMeterErrorsMap?: IKnownErrorsMap | undefined;
    knownCarbonErrorsMap?: IKnownErrorsMap | undefined;
}) => ({ item0, item1, }: {
    item0: {
        timestamp: Date;
        meterId: string;
        region: string;
    };
    item1: {
        timestamp: Date;
        meterId: string;
        region: string;
    };
}) => boolean;
