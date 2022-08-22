import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type {
  IAuthenticationResult,
  ICommonRole,
  IValidatedUser,
} from '@tymlez/platform-api-interfaces';
import { JwtAuthGuard, Roles, RolesGuard } from '@tymlez/backend-libs';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './LocalAuthGuard';
import type { Client } from './entities/Client.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request): Promise<IAuthenticationResult> {
    return this.authService.login(req.user as IValidatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request): IValidatedUser {
    return req.user as IValidatedUser;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICommonRole>('admin')
  @Get('clients')
  getClients(): Promise<Client[]> {
    return this.authService.getClients();
  }
}
