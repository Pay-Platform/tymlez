import { IEnergyTimeSeries } from '@tymlez/platform-api-interfaces/src/time-series';

export interface ICohortCircuitHistory {
  series: Array<IEnergyTimeSeries>;
}

export interface ICohortCircuitForecast {
  series: Array<IEnergyTimeSeries>;
}

export interface ICohortCircuitRealtime {
  series: Array<IEnergyTimeSeries>;
}
