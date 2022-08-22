import { Module } from '@nestjs/common';
import { MeterQdbModule } from '../meter-qdb/meter-qdb.module';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';

@Module({
  imports: [MeterQdbModule],
  controllers: [DebugController],
  providers: [DebugService],
})
export class DebugModule {}
