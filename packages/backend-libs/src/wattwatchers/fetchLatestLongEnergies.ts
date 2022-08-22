import { runAllSettled } from '@tymlez/common-libs';
import axios from 'axios';
import { logger } from '../pino';
import { WATTWATCHERS_API_URL } from './constants';
import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
import { energyResponseItemSchema } from './energyResponseSchema';

export async function fetchLatestLongEnergies({
  requests,
}: {
  requests: {
    deviceId: string;
    apiKey: string;
  }[];
}): Promise<(IWattwatchersLongEnergyResponseItem | Error)[]> {
  return runAllSettled(requests, async (requestOrError) => {
    if (requestOrError instanceof Error) {
      return requestOrError;
    }

    const { deviceId, apiKey } = requestOrError;

    const params = {
      'convert[energy]': 'kWh',
    };

    logger.info(params, `Fetching latest long energy for ${deviceId}`);

    const { data } = await axios.get(
      `${WATTWATCHERS_API_URL}/long-energy/${deviceId}/latest`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params,
      },
    );

    const dataWithMeterId = {
      ...data,
      meter_id: deviceId,
    };

    await energyResponseItemSchema.validateAsync(dataWithMeterId, {
      abortEarly: false,
      allowUnknown: true,
    });

    return dataWithMeterId as IWattwatchersLongEnergyResponseItem;
  });
}
