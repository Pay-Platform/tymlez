import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Site } from '../site/entities/Site.entity';
import { MeterQdbModule } from '../meter-qdb/meter-qdb.module';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';

import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';

@Module({
  imports: [MikroOrmModule.forFeature([Site]), MeterQdbModule],
  controllers: [GenerationController],
  providers: [MeterQdbService, GenerationService],
  exports: [GenerationService],
})
export class GenerationModule {}
