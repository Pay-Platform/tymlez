FROM node:16.14-alpine3.14
ENV PLATFORM="docker"
ENV NODE_ENV="production"

ARG GIT_SHA=latest
ENV GIT_SHA="${GIT_SHA}"
ENV PORT=3010

WORKDIR /app

COPY *.* ./
COPY .yarn ./.yarn
COPY yarn.lock ./yarn.lock

COPY packages/common-libs ./packages/common-libs
COPY packages/backend-libs ./packages/backend-libs
COPY cli/tymlez-dev-cli ./cli/tymlez-dev-cli
COPY packages/platform-api-interfaces ./packages/platform-api-interfaces
COPY packages/test-libs ./packages/test-libs

COPY guardian/guardian-api-client ./guardian/guardian-api-client
COPY guardian/tymlez-guardian-service ./guardian/tymlez-guardian-service
COPY guardian/tymlez-guardian-cli ./guardian/tymlez-guardian-cli


COPY patches ./patches

RUN yarn || true

WORKDIR /app/guardian/tymlez-guardian-service
RUN yarn build
RUN rm -rf /app/.yarn/cache

EXPOSE 3010

CMD ["yarn", "start:prod"]
