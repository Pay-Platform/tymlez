import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@tymlez/backend-libs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Client } from './entities/Client.entity';
import { User } from './entities/User.entity';
import { LocalStrategy } from './LocalStrategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([Client, User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '12h'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
