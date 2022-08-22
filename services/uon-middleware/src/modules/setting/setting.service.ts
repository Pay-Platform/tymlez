import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';
import type { ISettings } from './entities/model';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: EntityRepository<Setting>,
  ) {}

  async getSettings(): Promise<ISettings> {
    const all = await this.settingRepository.findAll();
    const co2Factor = all.find((x) => x.key === 'co2_factor');
    return {
      co2Factor: +(co2Factor?.value || 0),
    };
  }
}
