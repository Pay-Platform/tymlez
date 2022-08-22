import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger } from '@tymlez/backend-libs';

export class ClientSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // seek client
    const { client_detail: client } = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );

    logger.info({ client }, 'Running client seeds');

    const [, count] = await em.findAndCount('Client', {
      name: client.name,
    });
    if (count === 0) {
      logger.info("Inserting client '%s'", client.name);
      await em.persistAndFlush(
        em.create('Client', {
          name: client.name,
          label: client.label,
          tags: ['initial'],
        }),
      );

      logger.info("Inserted client '%s'", client.name);
    } else {
      // TODO: Implement updated logic
      logger.info('Skip insert client as it already exists');
    }
  }
}
