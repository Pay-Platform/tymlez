import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Site } from '../site/entities/Site.entity';
import { MeterQdbService } from '../meter-qdb/meter-qdb.service';
import { CarbonController } from './carbon.controller';
import { CarbonService } from './carbon.service';

@Module({
  imports: [MikroOrmModule.forFeature([Site]), MeterQdbService],
  controllers: [CarbonController],
  providers: [CarbonService, MeterQdbService],
  exports: [CarbonService],
})
export class CarbonModule {}
