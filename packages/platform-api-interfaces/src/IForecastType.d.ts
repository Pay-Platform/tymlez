export type IForecastType =
  | 'fiveMin'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | ('monthly' & {});
