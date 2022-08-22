import type { IValidatedUser } from './IValidatedUser';

export interface IAuthenticationResult {
  accessToken: string;
  user: IValidatedUser;
}
