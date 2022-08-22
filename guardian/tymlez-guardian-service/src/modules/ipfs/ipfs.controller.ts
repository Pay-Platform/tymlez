import { Body, Controller, Post } from '@nestjs/common';
import { IpfsService } from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}
  @Post('/upload')
  async upload(@Body() body: any): Promise<string> {
    return await this.ipfsService.upload(body);
  }
}
