import { User } from '../../auth/entities/User.entity';

export class GetUserReturnDto {
  users: User[];
  total: number;
}
