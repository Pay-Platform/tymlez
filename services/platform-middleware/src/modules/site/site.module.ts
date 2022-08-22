import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Client } from '../auth/entities/Client.entity';
import { Site } from './entities/Site.entity';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [MikroOrmModule.forFeature([Site, Client]), AuthModule],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
