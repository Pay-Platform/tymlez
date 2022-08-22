import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { genReqId } from '@tymlez/backend-libs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SettingModule } from './modules/setting/setting.module';
import ormConfig from './mikro-orm.config';
import { TokenMintModule } from './modules/token-mint/token-mint.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId,
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    DashboardModule,
    SettingModule,
    TokenMintModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
