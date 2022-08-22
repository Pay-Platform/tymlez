# platform-meter-ingestion

GCP Cloud Functions that ingest meter data to QuestDB

# Local Development

```sh
yarn dev:up
```

# Top Level Design

<image src="./docs/top-level.svg" />

# QuestDB Tables Design

<image src="./docs/meta-data-db.svg" />

1. This matches the same unified schema as in the BigQuery, energy columns such as `eRealKwh` are arrays, where each array item corresponding to a channel, and the maximum number of channels is currently 6.
2. Please refer to [src/modules/meter-energy/IMeterEnergy.ts](src/modules/meter-energy/IMeterEnergy.ts) for more information.

# Design Decisions

1. This package consist of serverless cloud functions which are event based, small and short lifetime, therefore no need to use framework such as NestJS and Dependency Injection.
2. QuestDB does not support all standard SQL features, e.g., missing `UPDATE` and `DELETE FROM`; it also added some custom syntax and functions such as `ksum()`, `TIMESTAMP`, `PARTITION BY`. I have tested that MikroORM and Knex don't work with QuestDB. Therefore all queries and migrations are written in plain QuestDB supported SQL wrapped by data access functions, e.g., [src/modules/chanel-info/insertMeterChannelInfos.ts](src/modules/chanel-info/insertMeterChannelInfos.ts).
3. Although QuestDB supports SQL, do not think of it as Relational Database, it is an append only time series database, i.e., it does not support `UPDATE`, and `DELETE FROM`, need to take this into account when designing the table.
4. All secrets are in AWS SSM, loaded into GCP Cloud Functions environment variables at deployment time.

# Bootstrap

Add `ENV=local` to your `~/.bashrc` or `~/.zshrc`

# Migration to Meter DB (QuestDB)

1. Start QuestDB via docker compose in platform-middleware

   In the root folder run dev:up to create .env file and start questDB (amongts others) via docker compose

   ```sh
   cd ../..
   yarn dev:up
   ```

2. Run following command to generate a empty migration file

   ```sh
   yarn tools -- meter-db migration:create --name create-meter-table
   ```

3. Write SQL migration in newly created migration file, e.g., [src/migrations/20211022093116-create-meter-energy-table.ts](src/migrations/20211022093116-create-meter-energy-table.ts). QuestDB SQL are slightly different than the standard SQL, not all the syntax are supported, and some new types are added, e.g., TIMESTAMP, please refer to [QuestDB SQL](https://questdb.io/docs/reference/sql/create-table) for more information.

4. Run following command to migrate up to the latest version

   ```sh
   yarn tools -- meter-db migration:up
   ```

   Run following command to migrate down

   ```sh
   yarn tools -- meter-db migration:down
   ```

5. Run following command to seed meter db with test local data

   ```sh
   yarn tools -- meter-db seed:up
   ```

   Run following command to clear meter db from test local data

   ```sh
   yarn tools -- meter-db seed:down
   ```

6. Run following command to seed meter db with test local data continuously by interval in miliseconds( 15000 by default)

   ```sh
   yarn tools -- meter-db seed:continue --interval 15000
   ```

# How to test serverless functions locally?

1. Connect to the correct GCP project using `gcloud` CLI

   ```sh
   gcloud projects list
   gcloud config set project cohort-dev-332401
   ```

2. Create functional test for the serverless function you want to test. E.g., `services/src/functions/ingest-carbon-emissions/handleIngestCarbonEmissions.functional-test.ts`

   ```ts
   import type { IStorageEvent } from '../../modules/gcp-cloud-functions';
   import { handleIngestCarbonEmissions } from './handleIngestCarbonEmissions';

   describe('handleIngestCarbonEmissions', () => {
     it('should pass', async () => {
       await handleIngestCarbonEmissions({
         bucket: 'dev-cohort-tymlez-pipeline-export',
         name: 'aemo_dispatches/2022/01/19/202201190005_000000000000.json',
       } as IStorageEvent);
     }, 600_000);
   });
   ```

3. Run functional test: `CLIENT_NAME=cohort yarn test:functional -- --watch`
