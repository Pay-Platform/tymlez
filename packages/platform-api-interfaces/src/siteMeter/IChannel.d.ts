import { IMeter } from './IMeter';
import { ICircuit } from './ICircuit';
import { SafeNumber } from '../SafeNUmber';

export interface IChannel {
  label: string;
  name: string;
  circuit: ICircuit; //Foreign key to circuit
  meter: IMeter; //Foreign key to meter
  index_override?: SafeNumber;
}
