#!/bin/bash

set -e

echo -e "\n--- Dev up of platform-middleware ---"

# Create local .env file
yarn load-env
# if ! [ -e .env ]
# then
#   cp .template.env .env
#   echo '.env copied'
# else
#   echo '.env already exists'
# fi

# Run DB migration
npx mikro-orm migration:up

# Run DB seeding
yarn tools db seed:up
