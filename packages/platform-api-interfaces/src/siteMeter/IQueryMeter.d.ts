import { SafeNumber } from '../SafeNUmber';
import { IMeter } from './IMeter';

export type IQueryMeter = {
  total: SafeNumber;
  meters: IMeter[];
};
