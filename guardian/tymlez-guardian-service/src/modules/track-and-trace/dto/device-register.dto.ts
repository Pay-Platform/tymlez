import { IsNotEmpty } from 'class-validator';

export class DeviceRegisterDto {
  @IsNotEmpty()
  policyTag: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  deviceSchemaName: string;

  deviceId: string;
  @IsNotEmpty()
  deviceInfo: {
    deviceId: string;
    deviceLabel: string;
    deviceType: string;
    siteName: string;
  };
}
