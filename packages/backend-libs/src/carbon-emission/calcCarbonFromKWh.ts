import type {
  IMetricTon,
  IMetricTonPerMWh,
  kWh,
} from '@tymlez/platform-api-interfaces';

export function calcCarbonFromKWh({
  energyKWh,
  factor,
}: {
  energyKWh: kWh;
  factor: IMetricTonPerMWh;
}): IMetricTon {
  return (energyKWh / 1000) * factor;
}
