#!/bin/bash

set -e

echo -e "\n--- Dev up of the monorepo, starting all backing services ---"

if [ "$ENV" != "local" ]; then
  echo "Error: cannot run dev:up for non-local environment. Please set 'export ENV=local' in your shell configuration file"
  exit 1
fi

if [ "$CLEAN" = "true" ]; then
  echo "Cleaning up..."
  docker-compose down
  rm -rf .tmp/
fi

docker-compose up -d

timeout 90s bash -c "until docker exec tymlez-dev-postgres pg_isready ; do sleep 5 ; done"
