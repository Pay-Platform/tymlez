import { SafeNumber } from '../SafeNUmber';
import { IClient } from './IClient';

export interface ISite {
  name: string; // (must be unique)
  label: string;
  address: string;
  lat: SafeNumber; //Latitude
  lng: SafeNumber; //Longitude
  hasSolar: boolean;
  region: AustralianRegion;
  solcastResourceId?: string; //From Solcast (e.g. 6587-6532-5132-b217)
  client: IClient;
}
