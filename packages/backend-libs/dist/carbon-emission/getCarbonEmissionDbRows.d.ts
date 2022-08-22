import type { AustralianRegion } from '@tymlez/common-libs';
import type { ICarbonEmissionDbRow } from './ICarbonEmissionDbRow';
export declare function getCarbonEmissionDbRows({ region, fromTimestamp, toTimestamp, }: {
    region: AustralianRegion;
    fromTimestamp: Date;
    toTimestamp: Date;
}): Promise<ICarbonEmissionDbRow[]>;
