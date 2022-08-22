import { SafeNumber } from '../SafeNUmber';
import { ISite } from './ISite';

export type IQuerySite = {
  total: SafeNumber;
  sites: ISite[];
};
