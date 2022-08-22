import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { User } from '../auth/entities/User.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Client } from '../auth/entities/Client.entity';
import { GetUserReturnDto } from './dto/getUserReturn.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async deleteUsers(ids: string[]) {
    const usersPromises = ids.map((id) => this.userRepository.findOne({ id }));
    const deletedIds: string[] = [];
    return Promise.all(usersPromises)
      .then(async (users) => {
        const existingUsers = users.filter(
          (user): user is User => user !== null,
        );
        for (const user of existingUsers) {
          try {
            await this.userRepository.removeAndFlush(user as User);
            deletedIds.push(user.id);
          } catch (err) {
            // Ignore error
          }
        }
      })
      .then(() => {
        return {
          deletedIds,
        };
      });
  }

  async updateUser(id: string, updatedUser: UpdateUserDto) {
    const { email, roles, password } = updatedUser;

    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }

    const sameEmailUser = (await this.userRepository.findOne({
      email,
    })) as User;
    if (sameEmailUser && sameEmailUser.id !== user.id) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: 'Another user has already used this email',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    user.email = email;
    user.roles = roles;
    if (password) {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS || '13', 10),
      );
      user.password = hashedPassword;
    }
    try {
      await this.userRepository.persistAndFlush(user);
      return user;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: 'User modification failed',
          errors: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(user: CreateUserDto) {
    const { password, email, roles } = user;
    console.log({ password });
    const exists = await this.userRepository.count({ $or: [{ email }] });
    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: 'Email must be unique.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // TODO: Validate password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS || '13', 10),
    );
    const client = (await this.clientRepository.findOne({
      name: 'cohort',
    })) as Client;
    try {
      await this.userRepository.persistAndFlush(
        new User(email, hashedPassword, roles, client),
      );
      const createdUser = this.userRepository.findOne({ email });
      return createdUser;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: 'User insertion failed',
          errors: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      {
        message: 'User does not exists',
        errors: 'Invalid user id',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async getUsers(pageSize = 10, page = 0): Promise<GetUserReturnDto> {
    const users = await this.userRepository.findAll({
      limit: pageSize,
      offset: pageSize * page,
    });
    const total = await this.userRepository.count();
    return {
      users,
      total,
    };
  }
}
