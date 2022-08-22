export interface IMeterBcRecord {
  meterId: string;
  value: number;
  fromTime: number;
  toTime: number;
}
export interface IMeterBlockchain {
  record(record: IMeterBcRecord): void;
}
