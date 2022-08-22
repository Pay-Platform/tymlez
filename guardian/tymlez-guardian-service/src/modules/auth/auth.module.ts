import { Module } from '@nestjs/common';
import { ApiKeyStrategy } from './api-key.strategy';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
