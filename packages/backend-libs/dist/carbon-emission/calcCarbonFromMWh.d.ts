import type { IMetricTon, IMetricTonPerMWh, MWh } from '@tymlez/platform-api-interfaces';
export declare function calcCarbonFromMWh({ energyMWh, factor, }: {
    energyMWh: MWh;
    factor: IMetricTonPerMWh;
}): IMetricTon;
