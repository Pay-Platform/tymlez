import { Controller, Get, Param, ParseArrayPipe, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import type {
  ICarbonEmissionsRecord,
  ITimestampMsec,
  ISiteEmissionTotal,
} from '@tymlez/platform-api-interfaces';
import { CarbonService } from './carbon.service';

@Controller('carbon')
export class CarbonController {
  constructor(private carbonService: CarbonService) {}

  @ApiQuery({ name: 'since', required: false })
  @Get('/realtime/:siteName')
  async realtime(
    @Param('siteName') siteName: string,
    @Query('meterId') meterId: string,
    @Query('regionId') regionId: string,
    @Query('columns', new ParseArrayPipe({ items: String, separator: ',' }))
    columns: string[],
    @Query('since') since?: ITimestampMsec,
  ): Promise<ICarbonEmissionsRecord[]> {
    const result = await this.carbonService.realtime(
      siteName,
      meterId,
      regionId,
      columns,
      Number(since),
    );
    return result;
  }

  @ApiQuery({ name: 'since', required: false })
  @Get('/history/:siteName')
  async history(
    @Param('siteName') siteName: string,
    @Query('meterId') meterId: string,
    @Query('regionId') regionId: string,
    @Query('columns', new ParseArrayPipe({ items: String, separator: ',' }))
    columns: string[],
    @Query('from') from: ITimestampMsec,
    @Query('to') to: ITimestampMsec,
  ): Promise<ICarbonEmissionsRecord[]> {
    const result = await this.carbonService.history(
      siteName,
      meterId,
      regionId,
      columns,
      Number(from),
      Number(to),
    );
    return result;
  }

  @Get('/total/:siteName')
  async total(
    @Param('siteName') siteName: string,
    @Query('meterId') meterId: string,
    @Query('regionId') regionId: string,
    @Query('columns', new ParseArrayPipe({ items: String, separator: ',' }))
    columns: string[],
  ): Promise<ISiteEmissionTotal> {
    const result = await this.carbonService.total(
      siteName,
      meterId,
      regionId,
      columns,
    );
    return result;
  }
}
