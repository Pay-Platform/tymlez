import { UseQueryResult } from 'react-query';
import { ICarbonData } from '../dashboard/TEMPORARY';
import { HistoryQuery } from '../../components/HistoryQueryForm';

export interface ICarbonReportData {
  timestamp: ITimestampMsec;
  abated: number;
  produced: number;
}
export interface ICarbonReportField {
  title: string;
  description: string;
  subTitle: string;
  data: string;
}
export interface ICarbonReport {
  abated: ICarbonReportField;
  produced: ICarbonReportField;
  penetration: ICarbonReportField;
  data: ICarbonReportData[];
}

export type IHookReturnWithPeriod<T> = UseQueryResult<T> & {
  query: HistoryQuery;
  setQuery: Dispatch<SetStateAction<HistoryQuery>>;
};

export interface ICarbonAudit {
  source: string;
  measurement: number;
  units: string;
  carbon: number;
  auditLink: string;
}
