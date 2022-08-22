import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  MeterId,
  ITimestampMsec,
  IVerification,
  VerificationPeriod,
} from '@tymlez/platform-api-interfaces';
import type { IMeterData, IMeterService } from '@tymlez/backend-libs';
import type { IMeterDataProvider } from './interfaces/IMeterDataProvider.d';
import { MeterInfoService } from '../meter-info/meter-info.service';
import type { IVerificationProvider } from './interfaces/IVerificationProvider';

@Injectable()
export class MeterService implements IMeterService {
  constructor(
    @Inject('IMeterDataProvider') private meterDataProvider: IMeterDataProvider,
    @Inject('IVerificationProvider')
    private verificationProvider: IVerificationProvider,
    private meterInfoService: MeterInfoService,
  ) {}

  async getHistory(
    meterIds: MeterId[],
    from: Date,
    to: Date,
  ): Promise<IMeterData> {
    return this.meterDataProvider.getHistory(meterIds, from, to);
  }

  async getRealtime(
    meterIds: MeterId[],
    limit: number,
    since?: ITimestampMsec,
  ): Promise<IMeterData> {
    return this.meterDataProvider.getRealtime(meterIds, limit, since);
  }

  public async getVerification(
    siteName: string,
    period: VerificationPeriod,
    page: number,
    pageSize: number,
  ): Promise<IVerification> {
    const meter = await this.meterInfoService.getMainMeterBySite(siteName);
    if (!meter) {
      throw new NotFoundException(`No main meter for site ${siteName}`);
    }
    const meterId = meter?.meter_id as MeterId;
    return await this.verificationProvider.getVerification(
      meterId,
      period,
      page,
      pageSize,
    );
  }
}
