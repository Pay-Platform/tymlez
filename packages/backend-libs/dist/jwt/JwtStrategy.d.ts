import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { IPassportStrategyValidateOutput } from './IPassportStrategyValidateOutput';
import type { IJwtAccessTokenPayload } from './IJwtAccessTokenPayload';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: IJwtAccessTokenPayload): Promise<IPassportStrategyValidateOutput>;
}
export {};
