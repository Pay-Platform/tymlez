export declare const getBuildTimeConfig: ({ env, clientName, }: {
    env: string;
    clientName: string;
}) => Promise<IConfig>;
interface IConfig {
    GUARDIAN_OPERATOR_ID?: string;
    GUARDIAN_OPERATOR_KEY?: string;
    GUARDIAN_TYMLEZ_API_KEY: string;
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
    DD_API_KEY?: string;
    GCP_PROJECT_ID?: string;
    GCP_REGION?: string;
    GKE_CLUSTER?: string;
    DEVICE_INFOS?: IDeviceInfo[];
}
export interface IDeviceInfo {
    deviceId: string;
    deviceLabel: string;
    deviceType: 'consumption' | 'generation' | 'generation-forecast';
    siteName: string;
}
export {};
