import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
export declare function fetchLongEnergies({ requests, }: {
    requests: {
        deviceId: string;
        apiKey: string;
        fromDate: Date;
        toDate?: Date;
    }[];
}): Promise<(IWattwatchersLongEnergyResponseItem[] | Error)[]>;
