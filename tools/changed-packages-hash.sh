
#!/bin/bash

#
# Used by .github/workflows to get the cache key from changed package-lock.json
#
# This is needed because restoring cache for all packages (not just changed packages) takes
# long time (more than 5 minutes), which defeat the purpose of caching
#

set -e

# If for some reason you need a fresh cache you can bump this number
MANUAL_CACHE_BUMP_VERSION=1

PACKAGES=$(lerna exec pwd --include-dependencies "$@" | sort)

echo "$MANUAL_CACHE_BUMP_VERSION" > ./changed-packages-hash-input.txt

for PACKAGE in $PACKAGES
do
  # echo $PACKAGE
  cat "$PACKAGE/package-lock.json" >> ./changed-packages-hash-input.txt
done

cat "package-lock.json" >> ./changed-packages-hash-input.txt

openssl sha256 ./changed-packages-hash-input.txt | awk '{print $2}'

