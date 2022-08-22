import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Measurements } from './entities/measurements.entity';
import { Setting } from '../setting/entities/setting.entity';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [MikroOrmModule.forFeature([Measurements, Setting]), SettingModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService, SettingModule],
})
export class DashboardModule {}
