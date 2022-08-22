import type {
  IVerification,
  MeterId,
  VerificationPeriod,
} from '@tymlez/platform-api-interfaces';

export interface IVerificationProvider {
  getVerification(
    meterId: MeterId,
    period: VerificationPeriod,
    page: number,
    pageSize: number,
  ): Promise<IVerification>;
}
