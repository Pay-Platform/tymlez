# Platform Middleware

Middleware / API layer of the Platform

# Local development

```sh
yarn dev:up

# Start dev server
yarn start:dev
```

# DB

## Create new migration file

First of all add your entities to `src/db/mikro-orm.config.ts`, because we use webpack, we cannot use dynamic entities discovery.

Run following command to generate migration file

```sh
yarn tools db migration:create -- --name <name of the migration>npm
# e.g.
yarn tools db migration:create -- --name create-user-table
```

## Create seed file

Create a file in `./src/db/seeders`, the `up` functions must be **idempotent** because they will called multiple times.

No secrets in the code, they should be loaded from environment variables or Terraform Cloud

# Meter DB (Quest DB)

All the meter data access to QuestDB will be encapsulated by `src/modules/meter-qdb`, because we would like to access all meter data via Mikro ORM, which will require us to write [custom driver](https://mikro-orm.io/docs/custom-driver/). Having one module encapsulate all the meter data access will make the future transition easier.

## Test build docker locally

```sh
docker build -t platform-middleware --build-arg SIT_SHA=1 -f Dockerfile --progress plain ../..

```
