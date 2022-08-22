import type { JwtService } from '@nestjs/jwt';
export declare function getJwtAccessToken({ jwtService, user, }: {
    jwtService: Pick<JwtService, 'sign'>;
    user: IJwtAccessTokenInput;
}): string;
interface IJwtAccessTokenInput {
    id: string;
    email: string;
    roles: string[];
    clientName: string;
}
export {};
