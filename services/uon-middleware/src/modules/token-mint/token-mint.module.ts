import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SettingModule } from '../setting/setting.module';
import { TokenMint } from './entities/token.entity';
import { TokenMintService } from './token-mint.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TokenMint]),
    DashboardModule,
    SettingModule,
  ],
  providers: [TokenMintService],
})
export class TokenMintModule {}
