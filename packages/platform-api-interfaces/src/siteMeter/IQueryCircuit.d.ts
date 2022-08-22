import { SafeNumber } from '../SafeNUmber';
import { ICircuit } from './ICircuit';

export type IQueryCircuit = {
  total: SafeNumber;
  circuits: ICircuit[];
};
