#!/bin/bash

set -ex

yarn build-tools
yarn bootstrap:always "$@"
