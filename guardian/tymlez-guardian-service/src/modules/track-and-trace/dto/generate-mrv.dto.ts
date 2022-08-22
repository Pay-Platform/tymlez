import { IsNotEmpty } from 'class-validator';

export class GenerateMvcDto {
  @IsNotEmpty()
  policyTag: string;

  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  setting: {
    mrvTimestamp: string;
    mrvDuration: number;
    mrvEnergyAmount: number;
    mrvCarbonAmount: number;
  };
}
