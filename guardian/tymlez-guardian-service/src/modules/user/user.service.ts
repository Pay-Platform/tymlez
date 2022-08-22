import { Inject, Injectable } from '@nestjs/common';
import { waitFor } from '@tymlez/common-libs';
import type {
  GuardianClientApi,
  Session,
  User,
} from '@tymlez/guardian-api-client';
import type { UserType } from './interfaces';
import { ServiceBase } from '../serviceBase';

@Injectable()
export class UserService extends ServiceBase {
  @Inject('GuardianClientApi') api: GuardianClientApi;

  constructor() {
    super();
  }

  async initialUser(userType: UserType): Promise<any> {
    if (userType === 'RootAuthority') {
      return await this.initializeRootAuthority();
    }
    return await this.initInstaller(userType);
  }

  private async initializeRootAuthority() {
    const session = await this.loginAs('RootAuthority');
    const rootAuthority = await this.api.profile().getProfile(session);

    if (rootAuthority?.confirmed) {
      console.log('Skip because root config already initialized');
      return {
        message: 'Skip because root config already initialized',
      };
    }

    // await initRootConfigWithRetry({ guardianApiGatewayUrl, rootAuthority });
    await this.initRootConfig(session);
    return {
      success: true,
    };
  }

  async associateInstallerWithTokens(session: Session) {
    const tokens = await this.api.token().listTokens(session);
    if (tokens.length === 0) {
      throw new Error('No tokens found');
    }

    const notAssociatedTokens = tokens.filter((x) => !x.associated);
    for await (const toBeAssocated of notAssociatedTokens) {
      await this.api.token().associate(session, toBeAssocated.id);
    }
  }

  async initInstaller(username: UserType) {
    const session = await this.loginAs(username);
    const profile = await this.api.profile().getProfile(session);
    if (profile?.confirmed) {
      return {
        message: `User '${username}' is already initialized.`,
        profile,
      };
    }
    await this.initInstallerHederaProfile(session);

    return await this.api.profile().getProfile(session);
  }

  private async initInstallerHederaProfile(session: Session) {
    const randomKey = await this.api.demo().getRandomKey();

    await this.api.profile().updateProfile(session, session.username, {
      hederaAccountId: randomKey.id,
      hederaAccountKey: randomKey.key,
    });

    let userProfile = await this.api.profile().getProfile(session);

    while (!userProfile || !userProfile.confirmed) {
      console.log('Waiting for user to be initialized', userProfile);

      userProfile = await this.api.profile().getProfile(session);

      if (userProfile && userProfile.confirmed) {
        break;
      }
      if (userProfile && userProfile.failed) {
        console.log('failed to setup installer account, retrying.....');
        await this.initInstallerHederaProfile(session);
      }

      await waitFor(2000);
    }
  }

  private async initRootConfig(session: Session) {
    const randomKey = await this.api.demo().getRandomKey();

    console.log('Update profile with ', randomKey);
    const vcDoc = {
      '@context': {
        '@version': 1.1,
        '@vocab': 'https://w3id.org/traceability/#undefinedTerm',
        id: '@id',
        type: '@type',
        'RootAuthority&1.0.0': {
          '@id': 'undefined#RootAuthority&1.0.0',
          '@context': { date: { '@id': 'https://www.schema.org/text' } },
        },
      },
    };

    const vcDocUrl = await this.api.ipfs().upload(session, vcDoc);
    console.log('vcDocument URL', vcDocUrl);

    await this.api.profile().updateProfile(session, session.username, {
      vcDocument: {
        name: 'Tymlez',
        type: 'RootAuthority&1.0.0',
        '@context': [vcDocUrl],
      },
      hederaAccountId: randomKey.id,
      hederaAccountKey: randomKey.key,
    });

    let userProfile: User | undefined;

    while (!userProfile || !userProfile.confirmed) {
      console.log('Waiting for user to be initialized', userProfile);

      userProfile = await this.api.profile().getProfile(session);

      if (userProfile && userProfile.confirmed) {
        break;
      }
      if (userProfile && userProfile.failed) {
        throw new Error('Unable to setup root account');
      }
      await waitFor(2000);
    }
  }
}
