import { Module } from '@nestjs/common';
import { InstallerService } from './installer.service';
import { InstallerController } from './installer.controller';

@Module({
  providers: [InstallerService],
  controllers: [InstallerController],
})
export class InstallerModule {}
