import { runAllSettled } from '@tymlez/common-libs';
import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
import { fetchLongEnergy } from './fetchLongEnergy';

export async function fetchLongEnergies({
  requests,
}: {
  requests: {
    deviceId: string;
    apiKey: string;
    fromDate: Date;
    toDate?: Date;
  }[];
}): Promise<(IWattwatchersLongEnergyResponseItem[] | Error)[]> {
  return runAllSettled(requests, fetchLongEnergy);
}
