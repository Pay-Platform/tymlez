# Uon Middleware

Middleware / API layer of the Uon

# Local development

```sh
yarn dev:up

# Start dev server
yarn start:dev
```

## Test build docker locally

```
cd services/uon-middleware

docker build -t uon-middleware --build-arg SIT_SHA=1 -f Dockerfile --progress plain ../../

```
