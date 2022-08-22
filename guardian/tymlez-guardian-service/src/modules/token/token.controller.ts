import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { Token, TokenInfo } from '@tymlez/guardian-api-client';
import { ApiKeyGuard } from '../auth/api-key.guard';
import type { CreateTokenDto } from './dto/create-token.dto';
import { TokenService } from './token.service';
import type { UserKycDto } from './dto/user-kyc.dto';

@Controller('tokens')
@UseGuards(ApiKeyGuard)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Get('/')
  get(): Promise<TokenInfo[]> {
    return this.tokenService.listTokens();
  }

  @Post('/create')
  @Post('/')
  async createToken(@Body() token: CreateTokenDto): Promise<TokenInfo[]> {
    const t = { ...token };
    return await this.tokenService.createToken(t as Token);
  }

  @Post('/user-kyc')
  async kycUser(@Body() input: UserKycDto): Promise<TokenInfo> {
    return await this.tokenService.kycUserWithToken(
      input.tokenId,
      input.username,
    );
  }
}
