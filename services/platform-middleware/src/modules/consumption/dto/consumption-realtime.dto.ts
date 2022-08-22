import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ConsumptionRealtimeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  //   @Transform(({value}) => Number(value))
  since: ITimestampMsec;
}
