import type { IInstaller } from './IInstaller';
import type { kW } from '../kW';

export type IQueryInstaller = {
  total: kW;
  installers: IInstaller[];
};
