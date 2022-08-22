import { SafeNumber } from '../SafeNUmber';
import { IChannel } from './IChannel';

export type IQueryChannel = {
  total: SafeNumber;
  channels: IChannel[];
};
