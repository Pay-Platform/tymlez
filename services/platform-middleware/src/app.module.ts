import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { LoggerModule } from 'nestjs-pino';
import { genReqId } from '@tymlez/backend-libs';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { SiteModule } from './modules/site/site.module';
import ormConfig from './db/mikro-orm.config';
import meterKnexConfig from './db/meter-knex.config';
import { ConsumptionModule } from './modules/consumption/consumption.module';
import { MeterModule } from './modules/meter/meter.module';
import { MeterInfoModule } from './modules/meter-info/meter-info.module';
import { DebugModule } from './modules/debug/debug.module';
import { GenerationModule } from './modules/generation/generation.module';
import { MeterQdbModule } from './modules/meter-qdb/meter-qdb.module';
import { CarbonModule } from './modules/carbon/carbon.module';
import { InstallerModule } from './modules/installer/installer.module';
import { UserModule } from './modules/user/user.module';

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
    KnexModule.forRoot(
      {
        config: meterKnexConfig,
      },
      'meter-db',
    ),
    AuthModule,
    SiteModule,
    ConsumptionModule,
    MeterInfoModule,
    MeterQdbModule,
    CarbonModule,
    MeterModule,
    DebugModule,
    GenerationModule,
    InstallerModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
