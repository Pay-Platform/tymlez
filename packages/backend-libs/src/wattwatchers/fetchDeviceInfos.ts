import axios from 'axios';
import Joi from 'joi';
import { runAllSettled } from '@tymlez/common-libs';
import { logger } from '../pino';
import { WATTWATCHERS_API_URL } from './constants';

export async function fetchDeviceInfos({
  devices,
}: {
  devices: {
    deviceId: string;
    apiKey: string;
  }[];
}): Promise<(IWattwatchersDeviceResponse | Error)[]> {
  return runAllSettled(devices, async ({ deviceId, apiKey }) => {
    logger.info({ deviceId }, 'Fetching device info ');

    const { data } = await axios.get(
      `${WATTWATCHERS_API_URL}/devices/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    await deviceSchema.validateAsync(data, {
      abortEarly: false,
      allowUnknown: true,
    });

    return data as IWattwatchersDeviceResponse;
  });
}

export const deviceSchema = Joi.object<IWattwatchersDeviceResponse>({
  id: Joi.string().required(),

  channels: Joi.array()
    .required()
    .items(
      Joi.object<IWattwatchersDeviceChannel>({
        id: Joi.string().required(),
        label: Joi.string().required(),
        categoryId: Joi.number().required(),
        categoryLabel: Joi.string().required(),
      }),
    ),
});

export interface IWattwatchersDeviceResponse {
  id: string;
  channels: IWattwatchersDeviceChannel[];
}

export interface IWattwatchersDeviceChannel {
  id: string;
  label: string;
  categoryId: number;
  categoryLabel: string;
}
