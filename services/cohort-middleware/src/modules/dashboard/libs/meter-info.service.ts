import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import type { IMeterInfoService, ICircuitMap } from '@tymlez/backend-libs';
import { getProxy } from '@tymlez/backend-libs';
import type { IContext } from '../context';

export class HttpMeterInfoService implements IMeterInfoService {
  constructor(private platformApiHost: string, private context: IContext) {}

  public async getCircuitMapBySite(siteName: string): Promise<ICircuitMap> {
    const params = { siteName };
    return getProxy<ICircuitMap>(
      `http://${this.platformApiHost}/api/meter-info/circuits`,
      this.context.authorizationHeader,
      '',
      params,
    );
  }
}

@Injectable()
export class MeterInfoServiceFactory {
  private readonly platformApiHost: string;

  constructor(configService: ConfigService) {
    this.platformApiHost = configService.get('PLATFORM_API_HOST', '');
    assert(this.platformApiHost, 'Set PLATFORM_API_HOST in env.');
  }

  getMeterInfoService(context: IContext): IMeterInfoService {
    return new HttpMeterInfoService(this.platformApiHost, context);
  }
}
