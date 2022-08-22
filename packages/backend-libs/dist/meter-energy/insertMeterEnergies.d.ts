import type { IInsertMeterEnergyInput } from './IInsertMeterEnergyInput';
export declare function insertMeterEnergies({ energies: allEnergies, skipCheckExists, }: {
    energies: IInsertMeterEnergyInput[];
    skipCheckExists: boolean | undefined;
}): Promise<void>;
