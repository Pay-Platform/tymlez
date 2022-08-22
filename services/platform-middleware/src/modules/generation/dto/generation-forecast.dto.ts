import { ApiProperty } from '@nestjs/swagger';
import type {
  IForecastType,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';

export class GenerationForecastDto {
  @ApiProperty()
  siteName: string;

  @ApiProperty()
  since: ITimestampMsec;

  @ApiProperty()
  forecastType: IForecastType;
}
