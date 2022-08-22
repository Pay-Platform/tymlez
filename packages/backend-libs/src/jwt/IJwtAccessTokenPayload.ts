export interface IJwtAccessTokenPayload {
  sub: string;
  email: string;
  roles: string[];
  clientName: string;
}
