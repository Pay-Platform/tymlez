import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  ids: string[];
}
