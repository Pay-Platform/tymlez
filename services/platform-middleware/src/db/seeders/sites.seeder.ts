// import assert from 'assert';
// import type { ClientBase } from 'pg';
import type { IBootstrap } from '@tymlez/backend-libs';

import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger } from '@tymlez/backend-libs';
import type { Site } from '../../modules/site/entities/Site.entity';

const TAGS = ['initial'];
export class SiteSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    logger.info('Running sites seeds');

    const { client_detail, site_details }: IBootstrap = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );
    const now = new Date();

    for await (const siteDetail of Object.values(site_details)) {
      const site = await em.findOne('Site', {
        name: siteDetail.name,
      });
      if (!site) {
        const client = await em.findOne('Client', { name: client_detail.name });
        logger.info("Inserting site '%s'", siteDetail.name);
        await em.persistAndFlush(
          em.create<Site>('Site', {
            ...siteDetail,
            createdAt: now,
            updatedAt: now,
            tags: TAGS,
            label: siteDetail.label,
            hasSolar: siteDetail.has_solar,
            solcastResourceId: siteDetail.solcast_resource_id,
            client,
          }),
        );

        logger.info("Inserted site '%s'", siteDetail.name);
      } else {
        // TODO: update site
        logger.info({ site }, 'Update existing site as it already exists');
      }
    }
  }
}
