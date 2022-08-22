# Tymlez Platform

Tymlez Platform Monorepo

```
tymlez-platform
├── clients
│   └── cohort-web                (Next.js/React web app for the cohort)
│   └── cohort-web-smoke          (Smoke test for the cohort-web)
├── packages
│   └── backend-libs              (TypeScript libraries for backend, can refer to NestJS)
│   └── cohort-api-interfaces     (TypeScript interfaces for Cohort API)
│   └── common-libs               (TypeScript libraries common for both frontend and backend, must not refer to NestJS or React)
│   └── devias-material-kit       (Devias Material Kit Pro v5, components library for all the clients, must not modify)
│   └── platform-api-interfaces   (TypeScript interfaces for Platform API)
│   └── test-libs                 (TypeScript libraries for unit test)
├── services
│   └── cohort-middleware         (NestJS middleware for the Cohort)
│   └── platform-meter-collection (AWS Lambda Functions that collect data and publish to GCP pubsub)
│   └── platform-meter-ingestion  (GCP Cloud Functions that ingest meter data to QuestDB)
│   └── platform-middleware       (NestJS middleware for the Tymlez platform)
└── tools                         (Tools for local development)

```

# Tools

1. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode&ssr=false#review-details)
2. [Homebrew](https://brew.sh/)
3. [nvm](https://github.com/nvm-sh/nvm)
4. [docker](https://www.docker.com/)
5. [jq](https://stedolan.github.io/jq/)

# Design Decisions

1. This is monorepo managed by Lerna and yarn workspaces, one major benefit of using a monorepo is that it can share dependencies among projects, e.g., [packages/backend-libs](packages/backend-libs), [packages/platform-api-interfaces](packages/platform-api-interfaces). We are not using Lerna's publishing and versioning features at the moment, because we alway build and deploy at the same time. We do use `learn run` and `lerna exec` to run command in the sub-packages.
2. Avoid shell script, use TypeScript for CLI instead. Refer to [clients/tymlez-web/tools](clients/tymlez-web/tools) and [cli/tymlez-dev-cli](cli/tymlez-dev-cli). This is because TypeScript is much more powerful, can be type checked and unit tested.
3. Do not use `yarn`, use `npm` instead
4. Do not use TypeScript specific features that not in JavaScript, e.g., `paths`. Because it will require us to configure many tools to understand the non-JS syntax, and it will increase complicity.
5. Never use the [Non-null assertion operator "!"](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator), it is always better to check `null/undefined` before using the variables, which will prevent one of most common JavaScript error: `Cannot access xxx of undefined.`
6. Do not disable eslint rule: `react-hooks/exhaustive-deps`, it will cause bug. Please refer to [React Hook Pitfalls - Kent C. Dodds](https://youtu.be/VIRcX2X7EUk?t=360), [Tips](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) and [Performance Optimizations](https://reactjs.org/docs/hooks-faq.html#performance-optimizations)
7. Do not set `err` in `catch(err)` to `any`, handle it using [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). Please refer to [How can I safely access caught Error properties in TypeScript?](https://stackoverflow.com/a/64452744)
8. Do not use `redux`, use [React Hooks](https://reactjs.org/docs/hooks-reference.html) instead. You can still use reducers, please refer to [clients/cohort-web/src/features/auth.tsx](clients/cohort-web/src/features/auth.tsx)
9. NestJS controllers should accept input as DTO but return only interfaces, and the interfaces should be defined in [packages/platform-api-interfaces](packages/platform-api-interfaces/README.md)

   ```ts
   async create(createUserDto: createUserDto): Promise<IUser> {
     return this.userService.create(createUserDto);
   }
   ```

10. Only use `class-transformer` in NestJS controllers, they are useful for converting `unknown` types from the network to DTO classes, but not good for converting database types to DTO classes, because they will prevent TypeScript type checking.
11. Do not share Input DTOs and output DTOs, they may look similar but the validation rules and constraints are different.
12. No need to use `propTypes` or `defaultProps`, because TypeScript already check props at build time.
13. Try to find utility functions from [lodash](https://lodash.com/) before write your own.
14. If you only need types from a package, you can use `import type` to solve the eslint error from `import/no-extraneous-dependencies`, e.g.,

    ```
    import type { TransactionResponse } from '@ethersproject/abstract-provider';
    ```

# Bootstrap (run once only)

```sh
nvm install 16
# will use node version in .nvmrc
nvm use

# run this once the first time (slow)
yarn set version berry
yarn
yarn build-tools # this to prebuild common-libs as next build doest not trigger the reference package build automatically
```

# Get Started

- Add `export ENV=local` to your shell configuration file, e.g., `~/.zshrc` or `~/.bashrc`, etc.

```sh
# Run this afterward instead of `yarn` (faster)
yarn bootstrap

yarn lint
yarn test

**Deprecated** Then follow instructions from sub-packages, e.g., [clients/cohort-web](clients/cohort-web/README.md), [services/platform-middleware](services/cohort-middleware/README.md)

## Run local development with docker

Make sure docker desktop is running. If client name is not set, it will default to UON

```

CLIENT_NAME=cohort yarn start:dev

```

When all service up below are all container in stack

- http://localhost:3000 -> client website. this is alias of - http://localhost:3001
- http://localhost:3000/admin -> platform admin website - alias of http://localhost:3002/admin
- http://localhost:8080 -> Platform API
- http://localhost:3001 -> client API
- http://localhost:8888/ -> Docker admin tools , this is useful tools to see the logs/ alternative to docker desktop

To clean up database, you can run below command

``
rm -rf local/.tmp
CLIENT_NAME=x yarn start:dev

``
You can still stay with legacy development flow by only running the core services with below command. it will start only mongo/redist/postgres and meter-db

```

yarn start:core

```

# Release to client production environments (`preprod` and `prod`)

1. Add `bootstrap-secrets.js` to client's middleware and upload to AWS S3, refer to [cli/tymlez-dev-cli/src/commands/bootstrap/samples/README.md](cli/tymlez-dev-cli/src/bootstrap/samples/README.md).

2. Commit the change from above step to `origin/main`

3. `CLIENT_NAME=<client_name> ENV=<env> yarn release`

# Troubleshoots

Refer to [TROUBLESHOOTS](docs/TROUBLESHOOTS.md)
```
