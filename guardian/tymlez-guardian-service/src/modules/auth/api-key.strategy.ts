import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private authService: AuthService) {
    super(
      { header: 'Authorization', prefix: 'Api-Key ' },
      true,
      (apikey: string, done: any) => {
        const apiKey = this.authService.validateApiKey(apikey);
        if (!apiKey) {
          return done(null, false);
        }
        return done(null, apiKey);
      },
    );
  }
}
