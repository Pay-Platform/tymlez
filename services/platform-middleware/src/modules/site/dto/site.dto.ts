import type { AustralianRegion } from '@tymlez/common-libs';
import type {
  ISite,
  ILatitude,
  ILongitude,
} from '@tymlez/platform-api-interfaces';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import type { Client } from '../../auth/entities/Client.entity';

export class SiteDto implements ISite {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  client: Client;

  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsLatitude()
  lat: ILatitude;

  @IsOptional()
  @IsLongitude()
  lng: ILongitude;

  @IsNotEmpty()
  hasSolar: boolean;

  @IsOptional()
  solcastResourceId: string;

  @IsString()
  @IsNotEmpty()
  region: AustralianRegion;
}
