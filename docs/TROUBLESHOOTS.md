# Troubleshoots

## tsc: command not found

Clean `node_modules` and re-install

```sh
yarn clean && yarn bootstrap
```

## timeout command not found

```sh
brew install coreutils
```

## SyntaxError: Unexpected token 'export' in `jest`

### Error

```ts
SyntaxError: Unexpected token 'export'

  2 | import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
  3 | import assert from 'assert';
> 4 | import pTimeout from 'p-timeout';
```

### Solution

Check if you are using `esbuild-jest` in `jest.config.js`, if so, add the error node module to `transformIgnorePatterns`. Refer to [backend-libs/jest.config.js](../packages/backend-libs/jest.config.js)
