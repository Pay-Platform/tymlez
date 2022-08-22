import { IsNotEmpty } from 'class-validator';

export class UserKycDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  tokenId: string;

  value: boolean;
}
