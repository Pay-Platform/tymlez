import type { IBootstrap } from '@tymlez/backend-libs';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger } from '@tymlez/backend-libs';
import assert from 'assert';
import { Channel } from '../../modules/meter-info/entities/Channel.entity';
import { Meter } from '../../modules/meter-info/entities/Meter.entity';
import { Circuit } from '../../modules/meter-info/entities/Circuit.entity';

export class ChannelSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    logger.info('running channel seeds');
    // seek client
    const BOOTSTRAP_DATA: IBootstrap = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );

    const { site_details } = BOOTSTRAP_DATA;

    const now = new Date();

    logger.info('Remove all existing channel');

    const channels = await em.find<Channel>('Channel', {});
    const meters = await em.find<Meter>(Meter, {});
    const circuits = await em.find<Circuit>(Circuit, {});

    for await (const siteDetail of Object.values(site_details)) {
      for await (const meterDetail of Object.values(siteDetail.meter_details)) {
        let arrayIndex = 1;
        for await (const channelDetail of meterDetail.channel_details) {
          const index = channelDetail.index_override ?? arrayIndex;
          const fullMeterName = `${siteDetail.name}-${meterDetail.name}`;
          const fullCircuitName = `${fullMeterName}-${channelDetail.circuit_name}`;
          const fullChannelName = `${fullMeterName}-${index}`;
          console.log('debug', fullChannelName);
          logger.info(
            { fullCircuitName, fullMeterName },
            "Inserting channel '%s'",
            fullChannelName,
          );
          const meter = meters.find((x) => x.name === fullMeterName);

          assert(meter !== null, `Meter '${fullMeterName}' not found`);
          const circuit = circuits.find((x) => x.name === fullCircuitName);
          assert(circuit !== null, `Circuit '${fullCircuitName}' not found`);
          const existingChannel = channels.find((x) => x.name);
          if (existingChannel) {
            continue;
          }
          const entity = em.create<Channel>(Channel, {
            name: fullChannelName,
            index,
            label: channelDetail.label,
            createdAt: now,
            updatedAt: now,
            tags: ['initial'],
            meter: meter as Meter,
            circuit: circuit as Circuit,
          });
          assert(entity !== null, `Channel '${fullChannelName}' not found`);
          await em.nativeInsert(entity);
          arrayIndex += 1;
          const [, channelCount] = await em.findAndCount<Channel>(Channel, {
            name: fullChannelName,
          });
          assert(
            channelCount === 1,
            `Number of inserted rows for '${fullChannelName}' is ${channelCount}, expect 1.`,
          );
        }
      }
    }

    logger.info(
      Object.values(site_details)
        .map((siteDetail) =>
          Object.values(siteDetail.meter_details)
            .map((meterDetail) =>
              meterDetail.channel_details.map(
                (channelDetail) =>
                  `${siteDetail.name}-${meterDetail.name} > ${channelDetail.label}`,
              ),
            )
            .flat(),
        )
        .flat(),
      'Channel seed details',
    );
  }
}
