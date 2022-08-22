import { IMeter } from './IMeter';

export interface ICircuit {
  name: string;
  label: string;
  meter: IMeter; //Foreign key to meter
}
