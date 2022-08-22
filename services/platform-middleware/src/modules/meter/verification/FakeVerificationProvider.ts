import type {
  MeterId,
  IVerification,
  VerificationPeriod,
} from '@tymlez/platform-api-interfaces';
import type { IVerificationProvider } from '../interfaces/IVerificationProvider';

const rnd = () => Math.round(Math.random() * 1000);

export class FakeVerificationProvider implements IVerificationProvider {
  public async getVerification(
    meterId: MeterId,
    _period: VerificationPeriod,
    page: number,
    pageSize: number,
  ): Promise<IVerification> {
    const num = 30;
    if (page * pageSize >= num) {
      return { records: [], num };
    }
    const now = Date.now();
    const records = new Array(Math.min(pageSize, num - page * pageSize))
      .fill(null)
      .map((_x, index) => ({
        vpId: meterId,
        vcRecords: [
          {
            mrvEnergyAmount: rnd(),
            mrvCarbonAmount: rnd(),
            mrvTimestamp: now + index * 5000,
            mrvDuration: 300,
          },
          {
            mrvEnergyAmount: rnd(),
            mrvCarbonAmount: rnd(),
            mrvTimestamp: now + index * 5000,
            mrvDuration: 300,
          },
        ],
        energyValue: rnd(),
        timestamp: now + index * 5000,
        co2Produced: rnd(),
      }));
    return { records, num };
  }
}
