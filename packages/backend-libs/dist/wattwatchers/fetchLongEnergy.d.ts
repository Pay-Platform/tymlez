import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
export declare function fetchLongEnergy({ deviceId, apiKey, fromDate, toDate, }: {
    fromDate: Date;
    toDate?: Date;
    deviceId: string;
    apiKey: string;
}): Promise<IWattwatchersLongEnergyResponseItem[]>;
