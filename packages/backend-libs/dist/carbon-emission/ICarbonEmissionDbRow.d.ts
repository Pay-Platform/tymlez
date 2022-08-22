import type { IMetricTon, IMetricTonPerMWh, MWh } from '@tymlez/platform-api-interfaces';
import type { AustralianRegion } from '@tymlez/common-libs';
export interface ICarbonEmissionDbRow {
    regionid: AustralianRegion;
    settlement_date: Date;
    energy: MWh;
    emission: IMetricTon;
    factor: IMetricTonPerMWh;
}
