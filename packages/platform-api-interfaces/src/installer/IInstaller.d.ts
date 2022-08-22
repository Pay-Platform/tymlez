import type { IDoc } from './IDoc';
import type { IUser } from '../auth/IValidatedUser';
import type { ITimestampMsec } from '../ITimestampMsec';

export type IInstaller = {
  id?: string;
  name: string;
  company: string;
  certificateNo: string;
  certificateUrl: string;
  createdAt: ITimestampMsec;
  createdBy?: IUser;
  certificateDocs: IDoc[];
};
