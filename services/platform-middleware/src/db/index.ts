import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';
import { DatabaseSeeder } from './seeders/database.seeder';

export async function migrateDb() {
  try {
    const orm = await MikroORM.init(config);
    const migrator = orm.getMigrator();
    console.log(await migrator.getPendingMigrations());
    await migrator.up(); // runs migrations up to the latest
    await orm.close(true);
  } catch (err) {
    console.log(err);
  }
}

export async function runSeeds() {
  const orm = await MikroORM.init(config);
  console.log(config);
  const seeder = orm.getSeeder();
  // await orm.getSchemaGenerator().refreshDatabase();

  await seeder.seed(DatabaseSeeder);
}
