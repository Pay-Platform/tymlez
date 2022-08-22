import type { JwtService } from '@nestjs/jwt';
import type { IJwtAccessTokenPayload } from './IJwtAccessTokenPayload';

export function getJwtAccessToken({
  jwtService,
  user,
}: {
  jwtService: Pick<JwtService, 'sign'>;
  user: IJwtAccessTokenInput;
}): string {
  const info: IJwtAccessTokenPayload = {
    sub: user.id,
    email: user.email,
    roles: user.roles,
    clientName: user.clientName,
  };
  if (user.roles.some((role) => role === 'permanent-display')) {
    return jwtService.sign(info, { expiresIn: '99y' });
  }
  return jwtService.sign(info);
}

interface IJwtAccessTokenInput {
  id: string;
  email: string;
  roles: string[];
  clientName: string;
}
