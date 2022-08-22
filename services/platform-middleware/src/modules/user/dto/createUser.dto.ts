import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  roles: string[];
}
