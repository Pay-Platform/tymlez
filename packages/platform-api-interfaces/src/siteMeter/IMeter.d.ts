import { ILatitude } from '../ILatitude';
import { ILongitude } from '../ILongitude';
import { IMeterReadingType } from '../IMeterReadingType';
import { ISite } from './ISite';
import { SafeNumber } from '../SafeNUmber';
import { IMeterStatus } from '../IMeterStatus';
import { ITimestampMsec } from '../ITimestampMsec';

export interface IMeter {
  name: string; // (must be unique)
  meter_id?: string; //ID of the Meter
  site: ISite; //foreign key to site
  label: string;
  description: string; //Description of Meter (Placement etc)
  lat?: ILatitude; //Latitude of Meter
  lng?: ILongitude; //Longitude of Meter
  type: IMeterReadingType;
  interval?: SafeNumber; //Interval the meter is set to, in seconds
  billingChannelIndex?: SafeNumber; //Number of the CT that is for Billing	(NULLABLE)
  isMain?: boolean;
  apiKey?: string; //API key for getting data from the device
  status: IMeterStatus; //allows to stop/resume fetching data from device
  activeFrom?: ITimestampMsec; //timestamp since when meter start emitting data (since when we should collect data for this meter).
}
