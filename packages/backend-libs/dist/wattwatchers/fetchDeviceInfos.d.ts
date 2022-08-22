import Joi from 'joi';
export declare function fetchDeviceInfos({ devices, }: {
    devices: {
        deviceId: string;
        apiKey: string;
    }[];
}): Promise<(IWattwatchersDeviceResponse | Error)[]>;
export declare const deviceSchema: Joi.ObjectSchema<IWattwatchersDeviceResponse>;
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
