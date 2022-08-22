import assert from 'assert';
import { isNil, range } from 'lodash';
import type { IWattwatchersLongEnergyResponseItem } from '../wattwatchers';
import { insertMeterEnergies } from './insertMeterEnergies';
import type { IInsertMeterEnergyInput } from './IInsertMeterEnergyInput';

const MAX_NUM_CHANNELS = 6;

export async function ingestMeterEnergies({
  requestId,
  energyResponses,
  skipCheckExists,
}: {
  requestId: string;
  energyResponses: IWattwatchersLongEnergyResponseItem[];
  skipCheckExists?: boolean;
}): Promise<void> {
  const energies = energyResponses.map((response) =>
    toEnergy(response, requestId),
  );

  await insertMeterEnergies({
    energies,
    skipCheckExists,
  });
}

function toEnergy(
  response: IWattwatchersLongEnergyResponseItem,
  requestId: string,
) {
  assert(
    response.eRealKwh.length !== 0,
    `For ${response.meter_id}, number of eRealKwh is ${response.eRealKwh.length}, ` +
      `expect more than 0.`,
  );

  ENERGY_KEYS.forEach((key) => {
    assert(
      response.eRealKwh.length === (response as any)[key]?.length,
      `For ${response.meter_id}, number of eRealKwh (${response.eRealKwh.length}) ` +
        `not equal to number of ${key} (${(response as any)[key]?.length})`,
    );
  });

  const energy = {
    meter_id: response.meter_id,
    duration: response.duration * 1000,
    timestamp: new Date(response.timestamp * 1000).toISOString(),
    requestId,

    ...range(0, MAX_NUM_CHANNELS).reduce((acc, i) => {
      return {
        ...acc,
        [`eRealKwh_${i}`]: response.eRealKwh[i],
        [`eRealNegativeKwh_${i}`]: response.eRealNegativeKwh[i],
        [`eRealPositiveKwh_${i}`]: response.eRealPositiveKwh[i],
        [`eReactiveKwh_${i}`]: response.eReactiveKwh[i],
        [`eReactiveNegativeKwh_${i}`]: response.eReactiveNegativeKwh[i],
        [`eReactivePositiveKwh_${i}`]: response.eReactivePositiveKwh[i],
        [`iRMSMin_${i}`]: response.iRMSMin[i],
        [`iRMSMax_${i}`]: response.iRMSMax[i],
        [`vRMSMin_${i}`]: response.vRMSMin[i],
        [`vRMSMax_${i}`]: response.vRMSMax[i],
      };
    }, {}),
  } as IInsertMeterEnergyInput;

  // Valid `energy at runtime because we constructed it dynamically
  // which TypeScript cannot catch the error
  ENERGY_KEYS.forEach((key) => {
    assert(
      !isNil((energy as any)[`${key}_0`]),
      `Missing ${key} in ${JSON.stringify(energy)}`,
    );
  });

  return energy;
}

const ENERGY_KEYS = [
  'eRealKwh',
  'eRealNegativeKwh',
  'eRealPositiveKwh',
  'eReactiveKwh',
  'eReactiveNegativeKwh',
  'eReactivePositiveKwh',
  'iRMSMin',
  'iRMSMax',
  'vRMSMin',
  'vRMSMax',
];
