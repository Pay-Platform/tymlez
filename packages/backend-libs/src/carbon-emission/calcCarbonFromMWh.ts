import type {
  IMetricTon,
  IMetricTonPerMWh,
  MWh,
} from '@tymlez/platform-api-interfaces';

export function calcCarbonFromMWh({
  energyMWh,
  factor,
}: {
  energyMWh: MWh;
  factor: IMetricTonPerMWh;
}): IMetricTon {
  return energyMWh * factor;
}
