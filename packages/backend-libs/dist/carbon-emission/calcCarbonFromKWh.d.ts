import type { IMetricTon, IMetricTonPerMWh, kWh } from '@tymlez/platform-api-interfaces';
export declare function calcCarbonFromKWh({ energyKWh, factor, }: {
    energyKWh: kWh;
    factor: IMetricTonPerMWh;
}): IMetricTon;
