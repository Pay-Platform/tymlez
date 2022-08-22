import assert from 'assert';
import type { IBootstrap } from '@tymlez/backend-libs';
import bcrypt from 'bcryptjs';
import { logger } from '@tymlez/backend-libs';
import { v4 as uuidv4 } from 'uuid';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import type { User } from '../../modules/auth/entities/User.entity';
import type { Client } from '../../modules/auth/entities/Client.entity';

const TAGS = ['initial'];
export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    logger.info('running channel seeds');
    const BOOTSTRAP_DATA: IBootstrap = JSON.parse(
      process.env.BOOTSTRAP_DATA || '{}',
    );
    const { SALT_ROUNDS } = process.env;

    assert(BOOTSTRAP_DATA, `BOOTSTRAP_DATA is missing`);
    assert(SALT_ROUNDS, `SALT_ROUNDS is missing`);

    const { client_detail, user_details } = BOOTSTRAP_DATA;

    const now = new Date();
    for await (const userDetail of Object.values(user_details)) {
      const [users, userCount] = await em.findAndCount<User>('User', {
        email: userDetail.email,
      });

      assert(
        userCount < 2,
        `Number of users for ${userDetail.email} is ${users.length}, expect less than 2`,
      );

      if (users.length === 0) {
        logger.info('Insert new user %s', userDetail.email);
        const client = await em.findOne<Client>('Client', {
          name: client_detail.name,
        });
        assert(client, `Client ${client_detail.name} is missing`);

        await em.persistAndFlush(
          em.create<User>('User', {
            email: userDetail.email,
            roles: userDetail.roles,
            id: uuidv4(),
            updatedAt: now,
            createdAt: now,
            tags: TAGS,
            client,
            password: await bcrypt.hash(
              (userDetail as any).password,
              +SALT_ROUNDS,
            ),
          }),
        );

        const [, rowCount] = await em.findAndCount('User', {
          email: userDetail.email,
        });

        assert(
          rowCount === 1,
          `Number of inserted rows for '${userDetail.email}' is ${rowCount}, expect 1.`,
        );
      } else {
        const updatedUser = users[0];
        updatedUser.roles = userDetail.roles;
        updatedUser.updatedAt = now;
        updatedUser.password = await bcrypt.hash(
          (userDetail as any).password,
          +SALT_ROUNDS,
        );

        await em.persistAndFlush(updatedUser);
      }
    }
    logger.info(`Added users ${Object.keys(user_details).join(', ')}`);
  }
}
