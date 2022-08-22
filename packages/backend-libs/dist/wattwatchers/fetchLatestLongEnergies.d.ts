import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
export declare function fetchLatestLongEnergies({ requests, }: {
    requests: {
        deviceId: string;
        apiKey: string;
    }[];
}): Promise<(IWattwatchersLongEnergyResponseItem | Error)[]>;
