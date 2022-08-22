import { Injectable } from '@nestjs/common';
import { ServiceBase } from '../serviceBase';

@Injectable()
export class IpfsService extends ServiceBase {
  async upload<T>(data: T): Promise<string> {
    const session = await this.loginAs('RootAuthority');
    return await this.api.ipfs().upload(session, data);
  }
}
