import { IsNotEmpty } from 'class-validator';

export class InstallerRegisterDto {
  @IsNotEmpty()
  policyTag: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  schemaName: string;

  @IsNotEmpty()
  installerInfo: {
    installerName: string;
    installerLicense: string;
  };
}
