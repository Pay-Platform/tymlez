import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Channel } from './entities/Channel.entity';
import { Circuit } from './entities/Circuit.entity';
import { Meter } from './entities/Meter.entity';
import { Site } from '../site/entities/Site.entity';
import { MeterInfoController } from './meter-info.controller';
import { MeterInfoService } from './meter-info.service';
import { SiteModule } from '../site/site.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { CircuitService } from './circuit.service';
import { CircuitController } from './circuit.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Site, Meter, Circuit, Channel]),
    AuthModule,
    SiteModule,
  ],
  controllers: [MeterInfoController, ChannelController, CircuitController],
  providers: [MeterInfoService, ChannelService, CircuitService],
  exports: [MeterInfoService, ChannelService, CircuitService],
})
export class MeterInfoModule {}
