import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { genReqId } from '@tymlez/backend-libs';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DebugModule } from './modules/debug/debug.module';
import { InstallerModule } from './modules/installer/installer.module';

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
    AuthModule,
    DashboardModule,
    DebugModule,
    InstallerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
