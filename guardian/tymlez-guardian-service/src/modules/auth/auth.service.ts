import { Injectable } from '@nestjs/common';
import { GUARDIAN_TYMLEZ_API_KEY } from '../../config';

@Injectable()
export class AuthService {
  validateApiKey(apikey: string) {
    if (apikey === GUARDIAN_TYMLEZ_API_KEY) {
      return {
        client: 'Tymlez Guardian Service',
      };
    }
    return null;
  }
}
