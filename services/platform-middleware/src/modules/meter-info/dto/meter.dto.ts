import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type {
  ILatitude,
  ILongitude,
  IMeter,
  IMeterReadingType,
  IMeterStatus,
  ISite,
  ITimestampMsec,
  ITimestampSec,
} from '@tymlez/platform-api-interfaces';

export class MeterDto implements IMeter {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  meter_id: string;

  @IsNotEmpty()
  site: ISite;

  @IsNotEmpty()
  label: string;

  @IsBoolean()
  @IsOptional()
  isMain: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: IMeterReadingType;

  @IsOptional()
  @IsLatitude()
  lat: ILatitude;

  @IsOptional()
  @IsLongitude()
  lng: ILongitude;

  @IsNumber()
  @IsOptional()
  interval: ITimestampSec;

  @IsOptional()
  @IsNumber()
  billingChannelIndex: number;

  @IsOptional()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsBoolean()
  status: IMeterStatus;

  @IsOptional()
  activeFrom: ITimestampMsec;
}
