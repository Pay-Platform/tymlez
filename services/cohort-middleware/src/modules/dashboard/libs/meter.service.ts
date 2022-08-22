import { Injectable } from '@nestjs/common';
import type { MeterId, ITimestampMsec } from '@tymlez/platform-api-interfaces';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import type { IMeterData, IMeterService } from '@tymlez/backend-libs';
import { getProxy } from '@tymlez/backend-libs';
import type { IContext } from '../context';

export class MeterService implements IMeterService {
  constructor(private platformApiHost: string, private context: IContext) {}

  public async getHistory(
    meterIds: MeterId[],
    from: Date,
    to: Date,
  ): Promise<IMeterData> {
    const params = {
      meterIds: meterIds.join(','),
      from: from.toISOString(),
      to: to.toISOString(),
    };
    return getProxy(
      `http://${this.platformApiHost}/api/meters/history`,
      this.context.authorizationHeader,
      '',
      params,
    );
  }

  async getRealtime(
    meterIds: MeterId[],
    limit: number,
    since?: ITimestampMsec,
  ): Promise<IMeterData> {
    const params = {
      meterIds: meterIds.join(','),
      limit,
      ...(since && { since }),
    };
    return getProxy(
      `http://${this.platformApiHost}/api/meters/realtime`,
      this.context.authorizationHeader,
      '',
      params,
    );
  }
}

@Injectable()
export class MeterServiceFactory {
  private readonly platformApiHost: string;

  constructor(configService: ConfigService) {
    this.platformApiHost = configService.get('PLATFORM_API_HOST', '');
    assert(this.platformApiHost, 'Set PLATFORM_API_HOST in env.');
  }

  getMeterService(context: IContext): IMeterService {
    return new MeterService(this.platformApiHost, context);
  }
}
