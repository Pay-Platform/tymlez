import type {
  IDoc,
  IInstaller,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';
import { IsNotEmpty } from 'class-validator';

export class InstallerDTO implements IInstaller {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  certificateNo: string;

  @IsNotEmpty()
  certificateUrl: string;

  @IsNotEmpty()
  createdAt: ITimestampMsec;

  @IsNotEmpty()
  certificateDocs: IDoc[];
}
