#!/bin/bash

set -e

echo -e "\n--- Dev up of platform-meter-ingestion ---"

# Create local .env file
yarn load-env

yarn tools meter-db migration:up

yarn tools meter-db seed:up
