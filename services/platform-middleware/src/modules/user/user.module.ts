import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/entities/User.entity';
import { Client } from '../auth/entities/Client.entity';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Client, User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
