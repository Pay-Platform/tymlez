import assert from 'assert';
import type { IBootstrap } from '@tymlez/backend-libs';
import { logger } from '@tymlez/backend-libs';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import type { Circuit } from '../../modules/meter-info/entities/Circuit.entity';
import type { Meter } from '../../modules/meter-info/entities/Meter.entity';

const TAGS = ['initial'];

export class CircuitSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const BOOTSTRAP_DATA: IBootstrap = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );
    const { site_details } = BOOTSTRAP_DATA;

    const now = new Date();

    for await (const siteDetail of Object.values(site_details)) {
      for await (const meterDetail of Object.values(siteDetail.meter_details)) {
        for await (const circuitDetail of meterDetail.circuit_details) {
          const fullMeterName = `${siteDetail.name}-${meterDetail.name}`;
          const fullCircuitName = `${fullMeterName}-${circuitDetail.name}`;

          const [circuits, count] = await em.findAndCount<Circuit>('Circuit', {
            name: fullCircuitName,
          });

          assert(
            circuits.length < 2,
            `Number of circuits for ${fullCircuitName} is ${circuits.length}, expect less than 2`,
          );

          if (count === 0) {
            logger.info('Insert circuit data');
            const meter = await em.findOne<Meter>('Meter', {
              name: fullMeterName,
            });

            await em.persistAndFlush(
              em.create<Circuit>('Circuit', {
                name: fullCircuitName,
                createdAt: now,
                updatedAt: now,
                tags: TAGS,
                label: circuitDetail.label,
                meter,
              }),
            );
            const [, rowCount] = await em.findAndCount('Circuit', {
              name: fullCircuitName,
            });

            assert(
              rowCount === 1,
              `Number of inserted rows for '${fullCircuitName}' is ${rowCount}, expect 1.`,
            );
          } else {
            // TODO: update existing circuit
            // assert(
            //   rowCount === 1,
            //   `Number of updated rows for '${fullCircuitName}' is ${rowCount}, expect 1.`,
            // );
          }
        }
      }
    }

    logger.info(
      Object.values(site_details)
        .map((siteDetail) =>
          Object.values(siteDetail.meter_details)
            .map((meterDetail) =>
              meterDetail.circuit_details.map(
                (circuitDetail) =>
                  `${siteDetail.name}-${meterDetail.name}-${circuitDetail.name}`,
              ),
            )
            .flat(),
        )
        .flat(),
      'Added circuits',
    );
  }
}
