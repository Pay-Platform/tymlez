export interface ISiteMeterRecord {
  timestamp: number;
  generated: number;
  consumed: number;
}

export type ISiteMeterRecords = Array<ISiteMeterRecord>;
