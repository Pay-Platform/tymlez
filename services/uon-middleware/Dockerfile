

FROM node:16.14-alpine3.14

ARG GIT_SHA=latest
ENV GIT_SHA="${GIT_SHA}"
ENV PORT=3000

WORKDIR /app

COPY *.* ./
COPY .yarn ./.yarn
COPY yarn.lock ./yarn.lock

COPY packages/common-libs ./packages/common-libs
COPY packages/backend-libs ./packages/backend-libs
COPY cli/tymlez-dev-cli ./cli/tymlez-dev-cli
COPY packages/platform-api-interfaces ./packages/platform-api-interfaces
COPY packages/test-libs ./packages/test-libs

COPY patches ./patches

COPY services/uon-middleware ./services/uon-middleware

RUN yarn || true
WORKDIR /app/services/uon-middleware
RUN yarn build
RUN rm -rf /app/.yarn/cache
EXPOSE 3000
CMD ["yarn", "start:prod"]