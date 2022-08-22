import { Controller, Post, Param } from '@nestjs/common';
import type { UserType } from './interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/init/:userType')
  async initGuardianUser(@Param('userType') userType: UserType): Promise<any> {
    return this.userService.initialUser(userType);
  }
}
