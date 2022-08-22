import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Installer } from './entities/installer.entity';

import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';

@Module({
  imports: [MikroOrmModule.forFeature([Installer]), AuthModule],
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService],
})
export class InstallerModule {}
