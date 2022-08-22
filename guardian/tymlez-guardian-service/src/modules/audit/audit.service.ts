// eslint-disable-this-file no-param-reassign
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { VerifiablePresentation } from '@tymlez/guardian-api-client';
import { DeviceConfig } from '../../schemas/device-config.schema';
import { ServiceBase } from '../serviceBase';
import type { IMrvSetting } from '../../interfaces/IMrvSetting';
import type { IVpRecord } from '../../interfaces/IVpRecord';

@Injectable()
export class AuditService extends ServiceBase {
  constructor(
    @InjectModel(DeviceConfig.name)
    private deviceConfigModel: Model<DeviceConfig>,
  ) {
    super();
  }

  async getVpDocumentsByDeviceId(deviceId: string): Promise<any> {
    // const { page, pageSize, period } = req.query as {
    //   page: number | undefined;
    //   pageSize: number | undefined;
    //   period: VerificationPeriod | undefined;
    // };

    const device = await this.deviceConfigModel.findOne({
      where: { deviceId },
    });
    // let filter: IFilter | null = null;

    if (device) {
      const auditor = await this.loginAs('Auditor');

      const trustchains = await this.api.trustchains(auditor).query();

      if (trustchains) {
        const finalData = {
          data: this.extractAndFormatVp(
            trustchains,
            device.deviceType,
            device.config.did,
          ),
        };
        console.log(finalData);
        return finalData;
      }
      return {};
    }
  }

  private extractAndFormatVp(
    vpDocuments: VerifiablePresentation[],
    deviceType: string,
    issuer: string,
  ): IVpRecord[] {
    return vpDocuments
      .filter((vp: any) =>
        vp.document.verifiableCredential.some(
          (vc: any) => vc.issuer === issuer,
        ),
      )
      .map((vpDocument: any) => {
        const vcRecords: IMrvSetting[] =
          vpDocument.document.verifiableCredential
            .slice(0, vpDocument.document.verifiableCredential.length - 1)
            .map((vc: any) => {
              return vc.credentialSubject.map((cs: any) => {
                return {
                  mrvEnergyAmount: Number(cs.mrvEnergyAmount),
                  mrvCarbonAmount: Number(cs.mrvCarbonAmount),
                  mrvTimestamp: cs.mrvTimestamp as string,
                  mrvDuration: Number(cs.mrvDuration),
                  mrvFuelAmount: Number(cs.mrvFuelAmount),
                  mrvWaterPumpAmount: Number(cs.mrvWaterPumpAmount),
                };
              });
            })
            .flat();

        const energyCarbonValue = vcRecords.reduce(
          (prevValue, vcRecord) => {
            // eslint-disable-next-line no-param-reassign
            prevValue.totalEnergyValue += Number(vcRecord.mrvEnergyAmount);
            // eslint-disable-next-line no-param-reassign
            prevValue.totalCarbonAmount += Number(vcRecord.mrvCarbonAmount);
            // eslint-disable-next-line no-param-reassign
            prevValue.totalFuelAmount += Number(vcRecord.mrvFuelAmount);
            // eslint-disable-next-line no-param-reassign
            prevValue.totalWaterPumpAmount += Number(
              vcRecord.mrvWaterPumpAmount,
            );

            return prevValue;
          },
          {
            totalEnergyValue: 0,
            totalCarbonAmount: 0,
            totalFuelAmount: 0,
            totalWaterPumpAmount: 0,
          },
        );
        const testnet = vpDocument.owner.includes('testnet')
          ? 'testnet'
          : 'app';

        return {
          vpId: vpDocument.document.id,
          energyType: deviceType,
          energyValue: energyCarbonValue.totalEnergyValue,
          co2Produced: energyCarbonValue.totalCarbonAmount,
          fuelConsumed: energyCarbonValue.totalFuelAmount,
          waterPumpAmount: energyCarbonValue.totalWaterPumpAmount,
          onChainUrl: `https://${testnet}.dragonglass.me/hedera/search?q="${vpDocument.document.id}"`,
          vcRecords,
          timestamp: vpDocument.createDate,
        } as IVpRecord;
      });
  }
}
