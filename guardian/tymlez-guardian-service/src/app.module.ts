import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GuardianClientApi } from '@tymlez/guardian-api-client';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_DB_CONNECTION, GUARDIAN_API_GW_URL } from './config';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { AuthModule } from './modules/auth/auth.module';
import { IpfsModule } from './modules/ipfs/ipfs.module';
import { AuditModule } from './modules/audit/audit.module';
import { PolicyModule } from './modules/policy/policy.module';
import { TrackAndTraceModule } from './modules/track-and-trace/track-and-trace.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'api-key' }),
    MongooseModule.forRoot(MONGO_DB_CONNECTION),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TokenModule,
    AuthModule,
    IpfsModule,
    AuditModule,
    PolicyModule,
    TrackAndTraceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'GuardianClientApi',
      useValue: new GuardianClientApi(GUARDIAN_API_GW_URL),
    },
  ],
  exports: ['GuardianClientApi'],
})
export class AppModule {}
