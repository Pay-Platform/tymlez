import { UUID } from '../../UUID';

interface ISite {
  id: UUID;
}

export interface IStorage {
  id: UUID;
  site: ISite;
  capacity: number;
}
export interface IStorageHistoryRecord {
  storageId: UUID;
  origin: string;
  userId: UUID;
  siteId: UUID;
  timestamp: number;
  duration: number;
  value: number;
}

export interface IStorageRecord {
  timestamp: Date;
  duration: number;
  value: number;
  origin: string;
  storage: IStorage;
}

export interface IStorageCacheReader {
  getRecords(siteId: UUID, since: number): Promise<Array<IStorageRecord>>;
}
