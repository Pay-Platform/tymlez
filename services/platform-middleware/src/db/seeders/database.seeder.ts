import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger } from '@tymlez/backend-libs';
import { ClientSeeder } from './client.seeder';
import { SiteSeeder } from './sites.seeder';
import { UserSeeder } from './users.seeder';
import { ChannelSeeder } from './channel.seeder';
import { CircuitSeeder } from './circuits.seeder';
import { MeterSeeder } from './meter.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    logger.info('Running database seeds');
    for await (const entity of [
      ClientSeeder,
      SiteSeeder,
      MeterSeeder,
      CircuitSeeder,
      ChannelSeeder,
      UserSeeder,
    ]) {
      await this.call(em.fork(), [entity]);
    }
  }
}
