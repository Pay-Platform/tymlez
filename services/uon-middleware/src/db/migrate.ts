import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';

export async function migrateDb() {
  const orm = await MikroORM.init(config);

  const migrator = orm.getMigrator();
  await migrator.up(); // runs migrations up to the latest
  await orm.close(true);
}
