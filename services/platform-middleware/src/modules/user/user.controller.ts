import {
  Body,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';
import { Roles, RolesGuard, JwtAuthGuard } from '@tymlez/backend-libs';
import type { ICommonRole } from '@tymlez/platform-api-interfaces';
import { User } from '../auth/entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { DeleteUserDto } from './dto/deleteUsers.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { DeleteUsersReturnDto } from './dto/deleteUsersReturn.dto';
import { GetUserReturnDto } from './dto/getUserReturn.dto';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Get('/')
  getUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetUserReturnDto> {
    return this.usersService.getUsers(pageSize, page);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Post('/')
  createUser(@Body() newUser: CreateUserDto): Promise<User | null> {
    return this.usersService.createUser(newUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updatedUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Delete('/')
  deleteUsers(@Body() body: DeleteUserDto): Promise<DeleteUsersReturnDto> {
    return this.usersService.deleteUsers(body.ids);
  }
}
