import { Inject } from '@nestjs/common';
import type {
  GuardianClientApi,
  PolicyBlockData,
  Session,
} from '@tymlez/guardian-api-client';
import { LOGIN_DETAILS } from './user/constants';
import type { UserType } from './user/interfaces';

export class ServiceBase {
  @Inject('GuardianClientApi') public api: GuardianClientApi;
  public async loginAs(username: UserType) {
    const data = LOGIN_DETAILS[username];
    return await this.api.auth().login(username, data.password);
  }

  public async getProfile(session: Session) {
    return await this.api.profile().getProfile(session);
  }

  public async getPolicyBlockData<T = PolicyBlockData>(
    session: Session,
    policyId: string,
    blockTag: string,
  ) {
    const blockId = await this.api
      .policy()
      .getBlockTagId(session, policyId, blockTag);
    if (!blockId.id) {
      throw new Error(
        `No block found for policyId: ${policyId} and blockTag: ${blockTag}`,
      );
    }

    return (await this.api
      .policy()
      .getBlockData(session, policyId, blockId.id)) as unknown as T;
  }

  public async setPolicyBlockData<T>(
    session: Session,
    policyId: string,
    blockTag: string,
    data: T,
  ) {
    const blockId = await this.api
      .policy()
      .getBlockTagId(session, policyId, blockTag);
    if (!blockId.id) {
      throw new Error(
        `No block found for policyId: ${policyId} and blockTag: ${blockTag}`,
      );
    }

    return await this.api
      .policy()
      .setBlockData(session, policyId, blockId.id, data);
  }
}
