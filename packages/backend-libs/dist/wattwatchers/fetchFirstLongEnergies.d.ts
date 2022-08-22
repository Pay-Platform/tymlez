import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
export declare function fetchFirstLongEnergies({ requests, }: {
    requests: {
        deviceId: string;
        apiKey: string;
    }[];
}): Promise<(IWattwatchersLongEnergyResponseItem | Error)[]>;
