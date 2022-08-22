export interface IDashboardBlockSummary {
  title: string;
  value: string;
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

export interface ChartSeries {
  name: string;
  type?: string;
  data: IPoint[];
  color: string;
}

export interface ICarbonReport {
  abated: ICarbonField;
  produced: ICarbonField;
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
  data: number;
}
