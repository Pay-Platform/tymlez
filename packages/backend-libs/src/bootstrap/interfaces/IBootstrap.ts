/* eslint-disable camelcase */

import type {
  IIsoDate,
  IMeterReadingType,
  IMeterStatus,
} from '@tymlez/platform-api-interfaces';
import type { AustralianRegion } from '@tymlez/common-libs';

export interface IBootstrap {
  client_detail: IClientDetail;
  site_details: Record<string, ISiteDetail>;
  user_details: Record<string, IUserDetail>;
  // Hash for bootstrap-secrets-{env}.json
  secrets_hash: string;
}

export interface IClientDetail {
  name: string;
  label: string;
}

export interface ISiteDetail {
  name: string; // (must be unique)
  label: string;
  address: string;
  lat: number; //Latitude
  lng: number; //Longitude
  has_solar: boolean;
  region: AustralianRegion;
  solcast_resource_id?: string; //From Solcast (e.g. 6587-6532-5132-b217)
  meter_details: Record<string, IMeterDetail>;
  solar_details?: Record<string, ISolarDetail>;
}

export interface IMeterDetail {
  name: string; // (must be unique)
  meter_id: string; //ID of the Meter
  label: string;
  description: string; //Description of Meter (Placement etc)
  lat: number; //Latitude of Meter
  lng: number; //Longitude of Meter
  type: IMeterReadingType;
  interval: number; //Interval the meter is set to, in seconds
  billing_channel_index?: number; //Number of the CT that is for Billing	(NULLABLE)
  circuit_details: ICircuitDetail[];
  channel_details: IChannelDetail[];
  isMain?: boolean;
  firstMeterEnergyTimestamp?: IIsoDate;
  // api_key?: string; //API key for getting data from the device
  status: IMeterStatus; //allows to stop/resume fetching data from device
  active_from?: IIsoDate; //timestamp since when meter start emitting data (since when we should collect data for this meter).
}

export interface ICircuitDetail {
  name: string;
  label: string;
}

export interface IChannelDetail {
  label: string;
  circuit_name: string; //Foreign key to above circuit.name
  index_override?: number;
}

export interface ISolarDetail {
  name: string; // (must be unique)
  label: string;
  meter_id?: string; //meter_id of meter connected to Solar
  lat?: number; //Latitude of PV Panels
  lng?: number; //Longitude of PV Panels
  ac_capacity: number; //AC Capacity of Inverter
  dc_capacity: number; //DC Capacity of Panels
  tracking?: ISolarTrackingType;
  inverter_url?: string; //URL to access inverter data
}

export type ISolarTrackingType = 'fixed' | 'horizontal';

export interface IUserDetail {
  email: string; // (must be unique)
  roles: string[];
}
