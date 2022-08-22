import type { IDeviceInfo } from '../getBuildTimeConfig';
export declare function addDevices({ GUARDIAN_TYMLEZ_API_KEY, GUARDIAN_TYMLEZ_SERVICE_BASE_URL, deviceInfos, }: {
    GUARDIAN_TYMLEZ_API_KEY: string;
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
    deviceInfos: IDeviceInfo[];
}): Promise<void>;
