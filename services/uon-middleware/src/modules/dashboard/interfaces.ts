import type { ITimestampMsec } from '@tymlez/common-libs';
import type { DateTime } from 'aws-sdk/clients/devicefarm';

export interface IUonSiteDetail {
  siteName: string;
}
export interface IUonDashboard {
  sites: any[];
}
export interface IDashboadBlockSummary {
  title: string;
  value: string;
  unit: string;
  percentageChange: number;
  percentageDuration: string;
  data?: IPoint[];
}

export interface ISiteData {
  title: string;
  energyMix: IData[];
}

export interface IData {
  name: string;
  data: IPoint[];
}

export interface IPoint {
  x: number | Date;
  y: number;
}

export interface IMeasurement {
  id: bigint;
  ts: DateTime;
  dt: string;
  register: string;
  val: string;
}

export interface IBattery {
  id: bigint;
  ts: string;
  register: string;
  current: number;
  soc_pc: number;
}

export interface ICarbonReport {
  abated: ICarbonField;
  produced: ICarbonField;
  penetration: ICarbonField;
  data: ICarbonData[];
}

export interface ICarbonData {
  timestamp: ITimestampMsec;
  abated: number;
  produced: number;
}

export interface ICarbonField {
  title: string;
  description: string;
  subTitle: string;
  data: string;
}

export interface ICarbonAudit {
  source: string;
  measurement: number;
  units: string;
  carbon: number;
  auditLink: string;
}
