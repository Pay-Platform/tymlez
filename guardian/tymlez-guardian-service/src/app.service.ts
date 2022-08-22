import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  info() {
    return {
      NAME: 'tymlez-service',
      BUILD_VERSION: process.env.BUILD_VERSION,
      DEPLOY_VERSION: process.env.DEPLOY_VERSION,
      OPERATOR_ID: process.env.OPERATOR_ID,
    };
  }
}
