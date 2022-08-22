import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';

export class ConsumptionForecastDto {
  @ApiProperty()
  siteName: string;

  @ApiPropertyOptional()
  since: ITimestampMsec;
}
