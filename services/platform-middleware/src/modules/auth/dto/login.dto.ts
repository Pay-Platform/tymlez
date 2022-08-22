import type { ILoginInput } from '@tymlez/platform-api-interfaces';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO implements ILoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
