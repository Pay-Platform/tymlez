import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  MeterId,
  IVerification,
  VerificationPeriod,
  gCo2ePerkWh,
  kWh,
} from '@tymlez/platform-api-interfaces';
import axios from 'axios';
import { Logger } from 'nestjs-pino';
import type { IVerificationProvider } from '../interfaces/IVerificationProvider';

interface IVcDto {
  mrvEnergyAmount: string;
  mrvCarbonAmount: string;
  mrvTimestamp: string;
  mrvDuration: string;
}
interface IVpDto {
  vpId: string;
  vcRecords: Array<IVcDto>;
  energyValue: kWh;
  timestamp: string;
  co2Produced: gCo2ePerkWh;
}

@Injectable()
export class GuardianVerificationProvider implements IVerificationProvider {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  public async getVerification(
    meterId: MeterId,
    period: VerificationPeriod,
    page: number,
    pageSize: number,
  ): Promise<IVerification> {
    try {
      const { data } = await axios.get(
        `${this.configService.get<string>(
          'GUARDIAN_TYMLEZ_SERVICE_BASE_URL',
        )}/audit/get-vp-documents/${meterId}?period=${period}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Api-Key ${this.configService.get<string>(
              'GUARDIAN_TYMLEZ_SERVICE_API_KEY',
            )}`,
          },
        },
      );

      this.logger.log('Meter VPs returned');
      this.logger.log(data);

      return {
        num: data.totalRecords,
        records: data.data.map((vp: IVpDto) => ({
          vpId: vp.vpId,
          vcRecords: vp.vcRecords.map((vc: IVcDto) => ({
            mrvEnergyAmount: Number(vc.mrvEnergyAmount),
            mrvCarbonAmount: Number(vc.mrvCarbonAmount),
            mrvTimestamp: new Date(vc.mrvTimestamp).getTime(),
            mrvDuration: Number(vc.mrvDuration),
          })),
          energyValue: vp.energyValue,
          timestamp: new Date(vp.timestamp).getTime(),
          co2Produced: vp.co2Produced,
        })),
      };
    } catch (err) {
      this.logger.error(
        { err },
        `Can't get Verification data for meterId: ${meterId}`,
      );
      throw err;
    }
  }
}
