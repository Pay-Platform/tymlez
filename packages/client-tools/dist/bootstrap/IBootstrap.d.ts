import type { IIsoDate, IMeterReadingType } from '@tymlez/platform-api-interfaces';
import type { AustralianRegion } from '@tymlez/common-libs';
export interface IBootstrap {
    client_detail: IClientDetail;
    site_details: Record<string, ISiteDetail>;
    user_details: Record<string, IUserDetail>;
    secrets_hash: string;
}
export interface IClientDetail {
    name: string;
    label: string;
}
export interface ISiteDetail {
    name: string;
    label: string;
    address: string;
    lat: number;
    lng: number;
    has_solar: boolean;
    region: AustralianRegion;
    solcast_resource_id?: string;
    meter_details: Record<string, IMeterDetail>;
    solar_details?: Record<string, ISolarDetail>;
}
export interface IMeterDetail {
    name: string;
    meter_id: string;
    label: string;
    description: string;
    lat: number;
    lng: number;
    type: IMeterReadingType;
    interval: number;
    billing_channel_index?: number;
    circuit_details: ICircuitDetail[];
    channel_details: IChannelDetail[];
    isMain?: boolean;
    firstMeterEnergyTimestamp?: IIsoDate;
}
export interface ICircuitDetail {
    name: string;
    label: string;
}
export interface IChannelDetail {
    label: string;
    circuit_name: string;
    index_override?: number;
}
export interface ISolarDetail {
    name: string;
    label: string;
    meter_id?: string;
    lat?: number;
    lng?: number;
    ac_capacity: number;
    dc_capacity: number;
    tracking?: ISolarTrackingType;
    inverter_url?: string;
}
export declare type ISolarTrackingType = 'fixed' | 'horizontal';
export interface IUserDetail {
    email: string;
    roles: string[];
}
