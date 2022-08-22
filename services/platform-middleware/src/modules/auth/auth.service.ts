import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import assert from 'assert';
import { getJwtAccessToken } from '@tymlez/backend-libs';
import type {
  IAuthenticationResult,
  IValidatedUser,
} from '@tymlez/platform-api-interfaces';
import { validateUser } from './libs/validateUser';
import { User } from './entities/User.entity';
import { Client } from './entities/Client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IValidatedUser | undefined> {
    const validatedUser = await validateUser({
      email,
      password,
      userRepository: this.userRepository,
    });

    return validatedUser
      ? {
          id: validatedUser.id,
          email: validatedUser.email,
          roles: validatedUser.roles,
          clientName: validatedUser.clientName,
        }
      : undefined;
  }

  async login(user: IValidatedUser): Promise<IAuthenticationResult> {
    assert(user, `user is missing`);

    return {
      accessToken: getJwtAccessToken({
        jwtService: this.jwtService,
        user,
      }),
      user,
    };
  }

  async getClient(clientName: string) {
    return this.clientRepository.findOne({ name: clientName });
  }

  async getClients() {
    return this.clientRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return (await this.userRepository.findOne({ id })) as User;
  }
}
