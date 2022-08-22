import type { IWattwatchersLongEnergyResponseItem } from '../wattwatchers';
export declare function ingestMeterEnergies({ requestId, energyResponses, skipCheckExists, }: {
    requestId: string;
    energyResponses: IWattwatchersLongEnergyResponseItem[];
    skipCheckExists?: boolean;
}): Promise<void>;
