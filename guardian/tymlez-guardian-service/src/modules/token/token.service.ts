import { Injectable } from '@nestjs/common';
import type { Token } from '@tymlez/guardian-api-client';

import { ServiceBase } from '../serviceBase';
import type { UserType } from '../user/interfaces';

@Injectable()
export class TokenService extends ServiceBase {
  async createToken(token: Token) {
    console.log('token to created', token);
    const session = await this.loginAs('RootAuthority');
    return await this.api.token().create(session, token);
  }

  async listTokens() {
    const session = await this.loginAs('RootAuthority');
    return await this.api.token().listTokens(session);
  }

  async associateTokenToUsers(tokenId: string, username: string) {
    const session = await this.loginAs(username as UserType);

    let tokens = await this.api.token().listTokens(session);
    const findMatchToken = tokens.find((token) => token.tokenId === tokenId);

    if (findMatchToken && !findMatchToken.associated) {
      await this.api.token().associate(session, tokenId);
      tokens = await this.api.token().listTokens(session);
      return tokens.find((token) => token.tokenId === tokenId);
    }

    return findMatchToken;
  }

  async kycUserWithToken(tokenId: string, username: string) {
    const userSession = await this.loginAs(username as UserType);

    const tokenKyc = await (
      await this.api.token().listTokens(userSession)
    ).find((x) => x.tokenId === tokenId);

    if (tokenKyc?.kyc) {
      console.log(
        'Skip KYC token as it already granted for user',
        username,
        tokenId,
      );
      return tokenKyc;
    }

    await this.associateTokenToUsers(tokenId, username);
    const session = await this.loginAs('RootAuthority' as UserType);
    return await this.api.token().grantKyc(session, tokenId, username);
  }
}
