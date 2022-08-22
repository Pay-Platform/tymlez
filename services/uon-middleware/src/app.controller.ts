import { Controller, Get } from '@nestjs/common';
import type { IMiddlewareVersion } from '@tymlez/platform-api-interfaces';

@Controller()
export class AppController {
  @Get('healthcheck')
  healthCheck(): string {
    return 'Ok';
  }

  @Get('version')
  getVersion(): IMiddlewareVersion {
    return {
      gitSha: process.env.GIT_SHA,
      gitTag: process.env.GIT_TAG,
    };
  }

  @Get('meta-info')
  getMetaInfo(): Object {
    return {
      gitSha: process.env.GIT_SHA,
      gitTag: process.env.GIT_TAG,
      ENV: process.env.ENV,
      NODE_ENV: process.env.NODE_ENV,
      TZ: process.env.TZ,
      PLATFORM_API_HOST: process.env.PLATFORM_API_HOST,
      NOW: new Date().toString(),
    };
  }
}
