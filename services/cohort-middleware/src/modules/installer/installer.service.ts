import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getProxy, postProxy } from '@tymlez/backend-libs';
import type {
  IAddInstallerResult,
  IInstaller,
  IQueryInstaller,
  ISummary,
} from '@tymlez/platform-api-interfaces';
import axios from 'axios';

@Injectable()
export class InstallerService {
  private platformApiHost: string | undefined;

  constructor(private configService: ConfigService) {
    this.platformApiHost = this.configService.get<string>('PLATFORM_API_HOST');
  }

  async getSummary(authorizationHeader: string, query: any) {
    return await getProxy<ISummary>(
      `http://${this.platformApiHost}/api/installer/summary`,
      authorizationHeader,
      '',
      query,
    );
  }

  async getAll(authorizationHeader: string, query: any) {
    return await getProxy<IQueryInstaller>(
      `http://${this.platformApiHost}/api/installer`,
      authorizationHeader,
      '',
      query,
    );
  }

  async addIntaller(installer: IInstaller, authorizationHeader: string) {
    return await postProxy<IAddInstallerResult>(
      `http://${this.platformApiHost}/api/installer`,
      authorizationHeader,
      installer,
    );
  }

  async getIntallerById(id: string, authorizationHeader: string) {
    return await getProxy<IInstaller>(
      `http://${this.platformApiHost}/api/installer/${id}`,

      authorizationHeader,
      '',
      {},
    );
  }

  async updateInstaller(installer: IInstaller, authorizationHeader: string) {
    const { data } = await axios.put<IAddInstallerResult>(
      `http://${this.platformApiHost}/api/installer/${installer.id}`,

      installer,

      {
        headers: {
          Authorization: authorizationHeader,
        },
      },
    );
    return data;
  }
}
