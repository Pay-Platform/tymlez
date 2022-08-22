import assert from 'assert';
import type { IBootstrap } from '@tymlez/backend-libs';
import { logger } from '@tymlez/backend-libs';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import type { Meter } from '../../modules/meter-info/entities/Meter.entity';
import type { Site } from '../../modules/site/entities/Site.entity';

export class MeterSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // seek client
    const BOOTSTRAP_DATA: IBootstrap = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );

    const { site_details } = BOOTSTRAP_DATA;

    const now = new Date();
    const TAGS = ['initial'];

    for await (const siteDetail of Object.values(site_details)) {
      for await (const meterDetail of Object.values(siteDetail.meter_details)) {
        const fullMeterName = `${siteDetail.name}-${meterDetail.name}`;

        const [meters, count] = await em.findAndCount<Meter>('Meter', {
          name: fullMeterName,
        });

        assert(
          count < 2,
          `Number of meters for ${fullMeterName} is ${count}, expect less than 2`,
        );

        if (count === 0) {
          const site = await em.findOne<Site>('Site', {
            name: siteDetail.name,
          });
          await em.persistAndFlush(
            em.create<Meter>('Meter', {
              ...meterDetail,
              name: fullMeterName,
              billingChannelIndex: meterDetail.billing_channel_index,
              meter_id: meterDetail.meter_id,
              tags: TAGS,
              createdAt: now,
              updatedAt: now,
              site,
              status: meterDetail.status || 'online',
              //activeFrom: meterDetail.active_from,
            }),
          );

          const [, rowCount] = await em.findAndCount('Meter', {
            name: fullMeterName,
          });

          assert(
            rowCount === 1,
            `Number of inserted rows for '${fullMeterName}' is ${rowCount}, expect 1.`,
          );
        } else {
          const updatedMetter = meters[0];
          logger.info({ updatedMetter }, 'Update meter info');
          updatedMetter.updatedAt = now;

          updatedMetter.label = meterDetail.label;
          updatedMetter.description = meterDetail.description;
          updatedMetter.type = meterDetail.type;
          updatedMetter.lat = meterDetail.lat;
          updatedMetter.lng = meterDetail.lng;
          updatedMetter.interval = meterDetail.interval;
          updatedMetter.billingChannelIndex = meterDetail.billing_channel_index;
          updatedMetter.isMain = meterDetail.isMain;
          updatedMetter.meter_id = meterDetail.meter_id;
          updatedMetter.status = meterDetail.status;
          // updatedMetter.activeFrom= meterDetail.active_from;
          await em.persistAndFlush(updatedMetter);
        }
      }
    }

    logger.info(
      Object.values(site_details).map((siteDetail) =>
        Object.values(siteDetail.meter_details).map(
          (meterDetail) =>
            `${siteDetail.name}-${meterDetail.name}-${meterDetail.meter_id}`,
        ),
      ),
      'Seeded meters result',
    );
  }
}
